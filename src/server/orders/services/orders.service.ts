import "server-only";

import { randomUUID } from "node:crypto";

import { resolveCartItems } from "@/server/catalog/services/catalog.service";
import {
  applyOrderPrintedStock,
  findUnstockedPrintedLines,
  restoreOrderPrintedStock,
} from "@/server/catalog/services/printed-stock.service";
import { sendOrderConfirmationEmail } from "@/server/email/order-confirmation";
import { sendOrderReceivedEmail } from "@/server/email/order-received";
import {
  findOrderById,
  findOrderByStripeSessionId,
  insertOrder,
  updateOrderPayment,
  updateOrderStatus,
} from "@/server/orders/repositories/orders.repository";
import { retrieveStripeCheckoutSession } from "@/server/payments/stripe";
import { resolvePrintifyLineItems } from "@/server/printify/line-items";
import {
  notifyAdminNewOrder,
  notifyAdminOrderPaid,
} from "@/server/payments/telegram";
import type {
  CreateOrderInput,
  OrderDocument,
  OrderFulfillmentType,
  OrderItem,
  OrderPaymentInfo,
} from "@/types/order";
import type { ShippingPickupPoint } from "@/types/shipping";
import { BOOK_FORMAT } from "@/constants/catalog";
import {
  type CountryCode,
  isPaymentMethodAvailable,
  isPurchasableAvailability,
  type PaymentMethod,
  roundToCents,
} from "@/utils";
import {
  calculateOrderShipping,
  type OrderShippingResult,
} from "@/server/orders/services/shipping.service";
import { getRegionCurrency } from "@/server/localization/localization.service";
import { resolvePickupPoint } from "@/server/shipping/services/pickup-points.service";
import {
  resolvePickupGroupIds,
  toOrderFulfillments,
} from "@/server/shipping/utils";

export class OrderValidationError extends Error {
  constructor(
    message: string,
    readonly code:
      | "empty_cart"
      | "unsupported_payment_method"
      | "unresolved_items"
      | "pricing_unavailable"
      | "shipping_unavailable"
      | "shipping_unsupported_destination"
      | "shipping_unsupported_parcel"
      | "shipping_missing_data"
      | "unsupported_variant"
      | "item_out_of_stock"
      | "pickup_point_required",
  ) {
    super(message);
    this.name = "OrderValidationError";
  }
}

const initialPaymentStatus = (
  method: PaymentMethod,
): OrderPaymentInfo["status"] => (method === "cod" ? "cod_pending" : "pending");

const shippingErrorCode = (
  status: Exclude<OrderShippingResult["status"], "ok">,
): OrderValidationError["code"] => {
  switch (status) {
    case "unsupported-destination":
      return "shipping_unsupported_destination";
    case "unsupported-variant":
      return "unsupported_variant";
    case "unsupported-parcel":
      return "shipping_unsupported_parcel";
    case "missing-shipping-data":
      return "shipping_missing_data";
    default:
      return "shipping_unavailable";
  }
};

export const createOrder = async (
  input: CreateOrderInput,
): Promise<OrderDocument> => {
  const { locale, country, items, paymentMethod } = input;

  if (items.length === 0) {
    throw new OrderValidationError("Cart is empty", "empty_cart");
  }

  if (!isPaymentMethodAvailable(country, paymentMethod)) {
    throw new OrderValidationError(
      `Payment method '${paymentMethod}' is not available for ${country}`,
      "unsupported_payment_method",
    );
  }

  const { items: resolved, isPricingUnavailable } = await resolveCartItems(
    locale,
    country,
    items,
  );

  if (isPricingUnavailable) {
    throw new OrderValidationError(
      "Prices could not be established for this region",
      "pricing_unavailable",
    );
  }

  if (resolved.length === 0) {
    throw new OrderValidationError(
      "No items could be resolved",
      "unresolved_items",
    );
  }

  if (!resolved.every((item) => isPurchasableAvailability(item.availability))) {
    throw new OrderValidationError(
      "Cart contains an item that is out of stock",
      "item_out_of_stock",
    );
  }

  const selectionsById = new Map(
    items.map((item) => [item.id, item.selections]),
  );

  const lineItems = resolved.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    selections: selectionsById.get(item.id),
    isDigital: item.isDigital ?? false,
    unitPrice: item.price,
  }));

  const unstockedLineIds = await findUnstockedPrintedLines(
    lineItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      isDigital: item.isDigital,
      language: item.selections?.language,
    })),
    (input.shippingAddress?.country ?? country) as CountryCode,
  );

  if (unstockedLineIds.size > 0) {
    throw new OrderValidationError(
      "Not enough printed copies for one of the items",
      "item_out_of_stock",
    );
  }

  const printifyResolution = await resolvePrintifyLineItems(lineItems);

  if (printifyResolution === null) {
    throw new OrderValidationError(
      "No Printify variant matches the selected options",
      "unsupported_variant",
    );
  }

  const orderItems: OrderItem[] = resolved.map((item) => ({
    productId: item.productId,
    slug: item.slug,
    title: item.title,
    emoji: item.emoji,
    thumbnailBackgroundColor: item.thumbnailBackgroundColor,
    variant: item.variant,
    formatSelection: selectionsById.get(item.id)?.format,
    languageSelection: selectionsById.get(item.id)?.language,
    unitPrice: item.price,
    quantity: item.quantity,
    lineTotal: roundToCents(item.price * item.quantity),
    printify: printifyResolution.linkByItemId.get(item.id),
  }));

  const fulfillmentType: OrderFulfillmentType = orderItems.every(
    (item) => item.formatSelection === BOOK_FORMAT.digital,
  )
    ? "digital"
    : "physical";

  const subtotal = roundToCents(
    orderItems.reduce((sum, item) => sum + item.lineTotal, 0),
  );

  const shippingResult = await calculateOrderShipping({
    country,
    items: lineItems,
    subtotal,
    selectedOptionIds: input.selectedShippingOptionIds,
    address: input.shippingAddress && {
      country: input.shippingAddress.country,
      region: input.shippingAddress.region,
      city: input.shippingAddress.city,
      postalCode: input.shippingAddress.postalCode,
      line1: input.shippingAddress.line1,
    },
  });

  if (shippingResult.status !== "ok") {
    throw new OrderValidationError(
      `Shipping could not be calculated (${shippingResult.status})`,
      shippingErrorCode(shippingResult.status),
    );
  }

  const unshippableGroup = shippingResult.groups.find((group) => group.issue);

  if (unshippableGroup?.issue) {
    throw new OrderValidationError(
      `Parcel ${unshippableGroup.id} cannot be shipped (${unshippableGroup.issue})`,
      shippingErrorCode(unshippableGroup.issue),
    );
  }

  const pickupPoints: Record<string, ShippingPickupPoint> = {};

  for (const groupId of resolvePickupGroupIds(shippingResult.groups)) {
    const pointId = input.pickupPointIds?.[groupId];
    const point =
      pointId && input.shippingAddress
        ? await resolvePickupPoint(
            {
              country: input.shippingAddress.country as CountryCode,
              region: input.shippingAddress.region,
              city: input.shippingAddress.city,
              postalCode: input.shippingAddress.postalCode,
              line1: input.shippingAddress.line1,
            },
            pointId,
          )
        : null;

    if (!point) {
      throw new OrderValidationError(
        `No pickup point for parcel ${groupId}`,
        "pickup_point_required",
      );
    }

    pickupPoints[groupId] = point;
  }

  const shipping = shippingResult.shipping;
  const fulfillments = toOrderFulfillments(shippingResult.groups, pickupPoints);
  const discount = 0;
  const total = roundToCents(subtotal + shipping - discount);

  const order: OrderDocument = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    userId: input.userId,
    locale,
    country,
    currency: await getRegionCurrency(country),
    items: orderItems,
    subtotal,
    shipping,
    discount,
    total,
    customer: input.customer,
    shippingAddress:
      fulfillmentType === "digital" ? undefined : input.shippingAddress,
    payment: {
      method: paymentMethod,
      status: initialPaymentStatus(paymentMethod),
    },
    status: "new",
    fulfillmentType,
    fulfillments: fulfillments.length > 0 ? fulfillments : undefined,
    notes: input.notes,
  };

  const saved = await insertOrder(order);
  void notifyAdminNewOrder(saved);
  if (paymentMethod !== "stripe") {
    await applyOrderPrintedStock(saved);
    void sendOrderReceivedEmail(saved);
  }

  return saved;
};

export type StripeRefundResult = {
  amountRefundedMinor: number;
  isFullyRefunded: boolean;
  refundId?: string;
};

export const applyStripeRefund = async (
  orderId: string,
  refund: StripeRefundResult,
): Promise<void> => {
  await updateOrderPayment(orderId, {
    status: refund.isFullyRefunded ? "refunded" : "paid",
    refundedAmount: roundToCents(refund.amountRefundedMinor / 100),
    refundedAt: new Date().toISOString(),
    lastRefundId: refund.refundId,
  });

  if (!refund.isFullyRefunded) {
    return;
  }

  const order = await findOrderById(orderId);

  if (order) {
    await restoreOrderPrintedStock(order);
  }
};

export const confirmOrderFromStripeSession = async (
  sessionId: string,
): Promise<OrderDocument | null> => {
  const [stripeSession, order] = await Promise.all([
    retrieveStripeCheckoutSession(sessionId).catch(() => null),
    findOrderByStripeSessionId(sessionId),
  ]);

  if (!order || !stripeSession) {
    return order ?? null;
  }

  if (
    order.payment.status !== "paid" &&
    stripeSession.payment_status === "paid"
  ) {
    const paymentIntent =
      typeof stripeSession.payment_intent === "string"
        ? stripeSession.payment_intent
        : stripeSession.payment_intent?.id;

    await updateOrderPayment(order.id, {
      status: "paid",
      stripeSessionId: sessionId,
      stripePaymentIntentId: paymentIntent,
      paidAt: new Date().toISOString(),
    });

    if (order.fulfillmentType === "digital") {
      await updateOrderStatus(order.id, "delivered");
    }

    const updatedOrder = {
      ...order,
      payment: { ...order.payment, status: "paid" as const },
    };

    await applyOrderPrintedStock(updatedOrder);

    void notifyAdminOrderPaid(updatedOrder);
    void sendOrderConfirmationEmail(updatedOrder);

    return updatedOrder;
  }

  return order;
};
