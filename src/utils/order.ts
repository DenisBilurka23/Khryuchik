import { BOOK_FORMAT } from "@/constants/catalog";
import type { Locale } from "@/i18n/config";
import {
  type AccountOrder,
  type AccountOrderItem,
  type CustomerOrderStatus,
  ORDER_STATUSES,
  type OrderCustomer,
  type OrderDocument,
  type OrderItem,
  type OrderPaymentStatus,
  type OrderStatus,
  type OrderTracking,
} from "@/types/order";

import { formatCurrency } from "./format-currency";
import { formatOrderNumber } from "./format-order-number";
import { formatPersonName } from "./person-name";

export const normalizeOrderEmail = (email: string) =>
  email.trim().toLowerCase();

export const formatCustomerName = (customer: OrderCustomer) =>
  formatPersonName(customer.firstName, customer.lastName);

export const isDigitalOrderItem = (item: OrderItem) =>
  !item.formatSelection || item.formatSelection === BOOK_FORMAT.digital;

export const hasLivePrintifyOrder = (order: {
  printifyOrder?: { printifyOrderId?: string; cancelledAt?: string };
}) =>
  Boolean(order.printifyOrder?.printifyOrderId) &&
  !order.printifyOrder?.cancelledAt;

export const getOrderTracking = (order: {
  printifyOrder?: {
    carrier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
  };
}): OrderTracking | undefined => {
  const trackingNumber = order.printifyOrder?.trackingNumber;

  if (!trackingNumber) {
    return undefined;
  }

  return {
    carrier: order.printifyOrder?.carrier,
    number: trackingNumber,
    url: order.printifyOrder?.trackingUrl,
  };
};

export const formatOrderTracking = (tracking: OrderTracking) =>
  [tracking.carrier, tracking.number].filter(Boolean).join(" · ");

export const isRefundableOrder = (order: {
  payment: {
    method: string;
    status: OrderPaymentStatus;
    refundedAmount?: number;
    stripePaymentIntentId?: string;
  };
}) =>
  order.payment.method === "stripe" &&
  order.payment.status === "paid" &&
  order.payment.refundedAmount === undefined &&
  Boolean(order.payment.stripePaymentIntentId);

export const isOrderStatus = (value: unknown): value is OrderStatus =>
  typeof value === "string" &&
  (ORDER_STATUSES as readonly string[]).includes(value);

export const getCustomerOrderStatus = (order: {
  status: OrderStatus;
  payment: { status: OrderPaymentStatus };
  fulfillmentType?: string;
}): CustomerOrderStatus => {
  if (order.status === "cancelled") return "cancelled";
  if (order.payment.status === "refunded") return "refunded";
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
  tracking: getOrderTracking(order),
});
