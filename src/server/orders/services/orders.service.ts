import "server-only";

import { randomUUID } from "node:crypto";

import { resolveCartItems } from "@/server/catalog/services/catalog.service";
import { insertOrder } from "@/server/orders/repositories/orders.repository";
import { notifyAdminNewOrder } from "@/server/payments/telegram";
import type {
  CreateOrderInput,
  OrderDocument,
  OrderItem,
  OrderPaymentInfo,
} from "@/types/order";
import {
  countryShippingConfig,
  getCountryCurrency,
  isPaymentMethodAvailable,
  type PaymentMethod,
} from "@/utils";

export class OrderValidationError extends Error {
  constructor(
    message: string,
    readonly code:
      | "empty_cart"
      | "unsupported_payment_method"
      | "unresolved_items",
  ) {
    super(message);
    this.name = "OrderValidationError";
  }
}

const round2 = (value: number) => Math.round(value * 100) / 100;

const initialPaymentStatus = (
  method: PaymentMethod,
): OrderPaymentInfo["status"] =>
  method === "cod" ? "cod_pending" : "pending";

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

  const resolved = await resolveCartItems(locale, country, items);

  if (resolved.length === 0) {
    throw new OrderValidationError(
      "No items could be resolved",
      "unresolved_items",
    );
  }

  const orderItems: OrderItem[] = resolved.map((item) => ({
    productId: item.productId,
    slug: item.slug,
    title: item.title,
    emoji: item.emoji,
    thumbnailBackgroundColor: item.thumbnailBackgroundColor,
    variant: item.variant,
    unitPrice: item.price,
    quantity: item.quantity,
    lineTotal: round2(item.price * item.quantity),
  }));

  const subtotal = round2(
    orderItems.reduce((sum, item) => sum + item.lineTotal, 0),
  );
  const shippingConfig = countryShippingConfig[country];
  const shipping =
    subtotal >= shippingConfig.freeShippingThreshold
      ? 0
      : shippingConfig.shippingPrice;
  const discount = 0;
  const total = round2(subtotal + shipping - discount);

  const order: OrderDocument = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    locale,
    country,
    currency: getCountryCurrency(country),
    items: orderItems,
    subtotal,
    shipping,
    discount,
    total,
    customer: input.customer,
    shippingAddress: input.shippingAddress,
    payment: {
      method: paymentMethod,
      status: initialPaymentStatus(paymentMethod),
    },
    status: "new",
    notes: input.notes,
  };

  const saved = await insertOrder(order);

  // Fire-and-forget admin notification — never block the customer or fail
  // the order if Telegram is misconfigured or unreachable.
  void notifyAdminNewOrder(saved);

  return saved;
};
