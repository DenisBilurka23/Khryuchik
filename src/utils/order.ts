import type { Locale } from "@/i18n/config";
import {
  type AccountOrder,
  type AccountOrderItem,
  type CustomerOrderStatus,
  ORDER_STATUSES,
  type OrderDocument,
  type OrderPaymentStatus,
  type OrderStatus,
} from "@/types/order";

import { formatCurrency } from "./format-currency";
import { formatOrderNumber } from "./format-order-number";

export const normalizeOrderEmail = (email: string) =>
  email.trim().toLowerCase();

export const isOrderStatus = (value: unknown): value is OrderStatus =>
  typeof value === "string" &&
  (ORDER_STATUSES as readonly string[]).includes(value);

// Maps the internal (admin) order/payment state to a single status the customer
// sees. Digital-only paid orders jump straight to "completed"; physical orders
// follow the normal shipping flow.
export const getCustomerOrderStatus = (order: {
  status: OrderStatus;
  payment: { status: OrderPaymentStatus };
  fulfillmentType?: string;
}): CustomerOrderStatus => {
  if (order.status === "cancelled") return "cancelled";
  if (order.status === "delivered") return "delivered";
  if (order.status === "shipped") return "shipped";
  if (order.status === "processing") return "confirmed";
  if (order.payment.status === "paid") {
    return order.fulfillmentType === "digital" ? "completed" : "confirmed";
  }
  return "pending";
};

const buildItemsSummary = (order: OrderDocument): string =>
  order.items.map((item) => item.title).join(" + ");

const toAccountOrderItem = (
  item: OrderDocument["items"][number],
): AccountOrderItem => ({
  title: item.title,
  emoji: item.emoji,
  variant: item.variant,
  formatSelection: item.formatSelection,
  quantity: item.quantity,
});

export const toAccountOrder = (
  order: OrderDocument,
  locale: Locale,
): AccountOrder => ({
  id: order.id,
  number: formatOrderNumber(order.id) ?? order.id,
  createdAt: order.createdAt,
  locale: order.locale,
  itemsSummary: buildItemsSummary(order),
  items: order.items.map(toAccountOrderItem),
  total: formatCurrency(order.total, locale, order.currency),
  status: getCustomerOrderStatus(order),
});
