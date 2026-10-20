import { BOOK_FORMAT } from "@/constants/catalog";
import { JETPRINT_ORDER_STATUS } from "@/constants/jetprint";
import type { Locale } from "@/i18n/config";
import {
  type AccountOrder,
  type AccountOrderItem,
  type CustomerOrderStatus,
  ORDER_STATUSES,
  type OrderDeleteBlocker,
  type OrderCustomer,
  type OrderDocument,
  type OrderFulfillment,
  type OrderItem,
  type OrderPaymentStatus,
  type OrderStatus,
  type OrderTracking,
} from "@/types/order";

import { formatCurrency } from "./format-currency";
import { formatOrderNumber } from "./format-order-number";
import { formatPersonName } from "./person-name";
import { roundToCents } from "./price-conversion";

export const normalizeOrderEmail = (email: string) =>
  email.trim().toLowerCase();

export const calculateOrderTotal = ({
  subtotal,
  shipping,
  discount,
}: {
  subtotal: number;
  shipping: number;
  discount: number;
}) => roundToCents(subtotal + shipping - discount);

export const formatCustomerName = (customer: OrderCustomer) =>
  formatPersonName(customer.firstName, customer.lastName);

export const isDigitalOrderItem = (item: OrderItem) =>
  !item.formatSelection || item.formatSelection === BOOK_FORMAT.digital;

export const hasLivePrintifyOrder = (order: {
  printifyOrder?: { printifyOrderId?: string; cancelledAt?: string };
}) =>
  Boolean(order.printifyOrder?.printifyOrderId) &&
  !order.printifyOrder?.cancelledAt;

export const hasLiveJetprintOrder = (order: {
  jetprintOrder?: { orderNo?: string; cancelledAt?: string };
}) =>
  Boolean(order.jetprintOrder?.orderNo) && !order.jetprintOrder?.cancelledAt;

export const canSubmitOrderToJetprint = (
  order: Pick<OrderDocument, "items" | "payment" | "status" | "jetprintOrder">,
) =>
  order.items.some((item) => Boolean(item.jetprint)) &&
  order.payment.status === "paid" &&
  order.status !== "cancelled" &&
  !hasLiveJetprintOrder(order);

export const getOrderDeleteBlocker = (
  order: Pick<OrderDocument, "printifyOrder" | "jetprintOrder">,
): OrderDeleteBlocker | undefined => {
  if (hasLivePrintifyOrder(order)) {
    return "blockedByPrintify";
  }

  if (hasLiveJetprintOrder(order)) {
    return "blockedByJetprint";
  }

  return undefined;
};

export const canCancelJetprintOrder = (
  order: Pick<OrderDocument, "jetprintOrder">,
) =>
  hasLiveJetprintOrder(order) &&
  order.jetprintOrder?.status !== JETPRINT_ORDER_STATUS.partiallyShipped &&
  order.jetprintOrder?.status !== JETPRINT_ORDER_STATUS.shipped;

export const getOrderTrackings = (order: {
  fulfillments?: Pick<
    OrderFulfillment,
    "source" | "carrier" | "trackingNumber" | "trackingUrl"
  >[];
}): OrderTracking[] =>
  (order.fulfillments ?? []).flatMap((fulfillment) =>
    fulfillment.trackingNumber
      ? [
          {
            carrier: fulfillment.carrier,
            number: fulfillment.trackingNumber,
            url: fulfillment.trackingUrl,
            source: fulfillment.source,
          },
        ]
      : [],
  );

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

export const isReviewableOrder = (order: {
  status: OrderStatus;
  payment: { status: OrderPaymentStatus };
  fulfillmentType?: string;
}): boolean => {
  if (order.payment.status !== "paid") {
    return false;
  }

  const status = getCustomerOrderStatus(order);

  return status === "delivered" || status === "completed";
};

export const canConfirmOrderDelivery = (order: OrderDocument): boolean =>
  (order.payment.status === "paid" || order.payment.status === "cod_pending") &&
  order.fulfillmentType !== "digital" &&
  order.status !== "delivered" &&
  order.status !== "cancelled";

const toAccountOrderItem = (
  item: OrderDocument["items"][number],
): AccountOrderItem => ({
  productId: item.productId,
  slug: item.slug,
  title: item.title,
  emoji: item.emoji,
  thumbnailBackgroundColor: item.thumbnailBackgroundColor,
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
  items: order.items.map(toAccountOrderItem),
  total: formatCurrency(order.total, locale, order.currency),
  status: getCustomerOrderStatus(order),
  trackings: getOrderTrackings(order),
  canConfirmDelivery: canConfirmOrderDelivery(order),
  canReview: isReviewableOrder(order),
});
