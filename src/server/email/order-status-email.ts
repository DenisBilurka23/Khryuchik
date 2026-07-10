import "server-only";

import type { OrderDocument, OrderStatus } from "@/types/order";

import { sendOrderCancelledEmail } from "./order-cancelled";
import { sendOrderDeliveredEmail } from "./order-delivered";
import { sendOrderShippedEmail } from "./order-shipped";

const statusEmailSenders: Partial<
  Record<OrderStatus, (order: OrderDocument) => Promise<void>>
> = {
  shipped: sendOrderShippedEmail,
  delivered: sendOrderDeliveredEmail,
  cancelled: sendOrderCancelledEmail,
};

export const sendOrderStatusEmail = (
  order: OrderDocument,
  previousStatus?: OrderStatus,
): void => {
  if (order.status === previousStatus) {
    return;
  }

  void statusEmailSenders[order.status]?.(order);
};
