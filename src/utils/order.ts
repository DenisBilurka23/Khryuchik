import type { Locale } from "@/i18n/config";
import {
  ORDER_STATUSES,
  type AccountOrder,
  type CustomerOrderStatus,
  type OrderDocument,
  type OrderPaymentStatus,
  type OrderStatus,
} from "@/types/order";

import { formatCurrency } from "./format-currency";
import { formatOrderNumber } from "./format-order-number";

export const isOrderStatus = (value: unknown): value is OrderStatus =>
  typeof value === "string" &&
  (ORDER_STATUSES as readonly string[]).includes(value);

// Maps the internal (admin) order/payment state to a single status the customer
// sees. COD/transfer orders stay "pending" until the admin processes them; paid
// Stripe orders are treated as confirmed automatically.
export const getCustomerOrderStatus = (order: {
  status: OrderStatus;
  payment: { status: OrderPaymentStatus };
}): CustomerOrderStatus => {
  if (order.status === "cancelled") return "cancelled";
  if (order.status === "delivered") return "delivered";
  if (order.status === "shipped") return "shipped";
  if (order.status === "processing") return "confirmed";
  if (order.payment.status === "paid") return "confirmed";
  return "pending";
};

const buildItemsSummary = (order: OrderDocument): string =>
  order.items.map((item) => item.title).join(" + ");

export const toAccountOrder = (
  order: OrderDocument,
  locale: Locale,
): AccountOrder => ({
  id: order.id,
  number: formatOrderNumber(order.id) ?? order.id,
  createdAt: order.createdAt,
  itemsSummary: buildItemsSummary(order),
  total: formatCurrency(order.total, locale, order.currency),
  status: getCustomerOrderStatus(order),
});
