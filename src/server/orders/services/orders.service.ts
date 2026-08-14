import "server-only";

import { randomUUID } from "node:crypto";

import { resolveCartItems } from "@/server/catalog/services/catalog.service";
import { sendOrderConfirmationEmail } from "@/server/email/order-confirmation";
import { sendOrderReceivedEmail } from "@/server/email/order-received";
import {
  findOrderByStripeSessionId,
  insertOrder,
  updateOrderPayment,
  updateOrderStatus,
} from "@/server/orders/repositories/orders.repository";
import { retrieveStripeCheckoutSession } from "@/server/payments/stripe";
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
import { BOOK_FORMAT } from "@/constants/catalog";
import { isPaymentMethodAvailable, type PaymentMethod } from "@/utils";
import {
  calculateOrderShipping,
  type OrderShippingResult,
} from "@/server/orders/services/shipping.service";
import { getRegionCurrency } from "@/server/localization/localization.service";

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
      | "unsupported_variant",
  ) {
    super(message);
    this.name = "OrderValidationError";
  }
}

const round2 = (value: number) => Math.round(value * 100) / 100;

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

  const selectionsById = new Map(
    items.map((item) => [item.id, item.selections]),
  );

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
    lineTotal: round2(item.price * item.quantity),
  }));

  const fulfillmentType: OrderFulfillmentType = orderItems.every(
    (item) => item.formatSelection === BOOK_FORMAT.digital,
  )
    ? "digital"
    : "physical";

  const subtotal = round2(
    orderItems.reduce((sum, item) => sum + item.lineTotal, 0),
  );

  const shippingResult = await calculateOrderShipping({
    country,
    items: resolved.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      selections: selectionsById.get(item.id),
    })),
    subtotal,
    isDigitalOnly: fulfillmentType === "digital",
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

  const shipping = shippingResult.shipping;
  const discount = 0;
  const total = round2(subtotal + shipping - discount);

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
    notes: input.notes,
  };

  const saved = await insertOrder(order);
  void notifyAdminNewOrder(saved);
  if (paymentMethod !== "stripe") {
    void sendOrderReceivedEmail(saved);
  }

  return saved;
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

    void notifyAdminOrderPaid(updatedOrder);
    void sendOrderConfirmationEmail(updatedOrder);

    return updatedOrder;
  }

  return order;
};
