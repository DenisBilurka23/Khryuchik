import "server-only";

import {
  JETPRINT_DELETED_WAYBILL_STATUS,
  JETPRINT_KNOWN_ORDER_STATUSES,
  JETPRINT_ORDER_STATUS,
  JETPRINT_SHIPPED_WAYBILL_STATUS,
  JETPRINT_SYNC_BUDGET_MS,
  JETPRINT_SYNC_WINDOW_DAYS,
} from "@/constants/jetprint";
import { sendOrderStatusEmail } from "@/server/email/order-status-email";
import {
  cancelJetprintOrder,
  fetchJetprintOrder,
  submitJetprintOrder,
} from "@/server/jetprint/services/jetprint-order.service";
import type { JetprintOrder } from "@/server/jetprint/types";
import {
  findOrderById,
  findOrdersAwaitingJetprint,
  type OrderFulfillmentPatch,
  updateOrderFulfillment,
  updateOrderJetprintOrder,
  updateOrderStatus,
} from "@/server/orders/repositories/orders.repository";
import {
  notifyAdminJetprintOrderCancelled,
  notifyAdminJetprintOrderFailed,
  notifyAdminJetprintOrderSubmitted,
  notifyAdminJetprintUnknownStatus,
} from "@/server/payments/telegram";
import type { OrderDocument, OrderFulfillment } from "@/types/order";
import {
  canSubmitOrderToJetprint,
  getJetprintOrderStatusKey,
  getOrderTrackings,
  hasLiveJetprintOrder,
  nextJetprintCustomerOrderNo,
  resolveNextJetprintOrderStatus,
} from "@/utils";

const DAY_MS = 24 * 60 * 60 * 1000;

const describeError = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

const resolveCustomerOrderNo = (order: OrderDocument) => {
  const previous = order.jetprintOrder;

  if (previous?.cancelledAt) {
    return nextJetprintCustomerOrderNo(order.id, previous.customerOrderNo);
  }

  return previous?.customerOrderNo ?? nextJetprintCustomerOrderNo(order.id);
};

export const submitOrderToJetprint = async (
  order: OrderDocument,
  { allowResubmission = false }: { allowResubmission?: boolean } = {},
): Promise<boolean> => {
  const wasCancelled =
    Boolean(order.jetprintOrder?.cancelledAt) ||
    order.jetprintOrder?.status === JETPRINT_ORDER_STATUS.cancelled;

  if (
    !canSubmitOrderToJetprint(order) ||
    (wasCancelled && !allowResubmission)
  ) {
    return false;
  }

  const customerOrderNo = resolveCustomerOrderNo(order);

  try {
    await updateOrderJetprintOrder(order.id, {
      customerOrderNo,
      orderNo: null,
      status: null,
      cancelledAt: null,
      cancelError: null,
    });

    const jetprintOrder = await submitJetprintOrder(order, customerOrderNo);

    await updateOrderJetprintOrder(order.id, {
      orderNo: jetprintOrder.orderNo,
      status: jetprintOrder.orderStatus,
      submittedAt: new Date().toISOString(),
      lastError: null,
    });
    await notifyAdminJetprintOrderSubmitted(order, jetprintOrder.orderNo);

    return true;
  } catch (error) {
    const reason = describeError(error);

    console.error(`Failed to submit order ${order.id} to JetPrint`, error);

    await updateOrderJetprintOrder(order.id, { lastError: reason }).catch(
      (updateError) =>
        console.error(
          `Failed to record the JetPrint error on order ${order.id}`,
          updateError,
        ),
    );
    await notifyAdminJetprintOrderFailed(order, reason);

    return false;
  }
};

export const cancelOrderInJetprint = async (
  order: OrderDocument,
): Promise<boolean> => {
  const orderNo = order.jetprintOrder?.orderNo;

  if (!orderNo || !hasLiveJetprintOrder(order)) {
    return false;
  }

  try {
    await cancelJetprintOrder(orderNo);
    await updateOrderJetprintOrder(order.id, {
      status: JETPRINT_ORDER_STATUS.cancelled,
      cancelledAt: new Date().toISOString(),
      cancelError: null,
    });

    return true;
  } catch (error) {
    console.error(`Failed to cancel JetPrint order ${orderNo}`, error);

    await updateOrderJetprintOrder(order.id, {
      cancelError: describeError(error),
    }).catch(() => undefined);

    return false;
  }
};

const activeWaybills = (jetprintOrder: JetprintOrder) =>
  (jetprintOrder.waybills ?? []).filter(
    (waybill) =>
      waybill.trackingNumber &&
      waybill.waybillStatus !== JETPRINT_DELETED_WAYBILL_STATUS,
  );

const isJetprintOrderShipped = (jetprintOrder: JetprintOrder) =>
  jetprintOrder.orderStatus === JETPRINT_ORDER_STATUS.partiallyShipped ||
  jetprintOrder.orderStatus === JETPRINT_ORDER_STATUS.shipped ||
  activeWaybills(jetprintOrder).some(
    (waybill) => waybill.waybillStatus === JETPRINT_SHIPPED_WAYBILL_STATUS,
  );

const buildParcelPatch = (
  parcel: OrderFulfillment,
  jetprintOrder: JetprintOrder,
  now: string,
): OrderFulfillmentPatch => {
  const waybills = activeWaybills(jetprintOrder);
  const waybill = waybills[0];
  const trackings = waybills.map((entry) => ({
    number: entry.trackingNumber!,
    ...(entry.carrier ? { carrier: entry.carrier } : {}),
    ...(entry.trackingUrl ? { url: entry.trackingUrl } : {}),
  }));
  const patch: OrderFulfillmentPatch = {};

  if (
    jetprintOrder.waybills &&
    JSON.stringify(parcel.trackings) !== JSON.stringify(trackings)
  ) {
    patch.trackings = trackings;
  }

  const put = <Key extends keyof OrderFulfillmentPatch>(
    key: Key,
    value: OrderFulfillmentPatch[Key],
  ) => {
    if (value && parcel[key] !== value) {
      patch[key] = value;
    }
  };

  put("status", getJetprintOrderStatusKey(jetprintOrder.orderStatus));
  for (const [key, value] of [
    ["carrier", waybill?.carrier],
    ["trackingNumber", waybill?.trackingNumber],
    ["trackingUrl", waybill?.trackingUrl],
  ] as const) {
    if (jetprintOrder.waybills && parcel[key] !== value) {
      patch[key] = value ?? null;
    }
  }

  if (isJetprintOrderShipped(jetprintOrder) && !parcel.shippedAt) {
    patch.shippedAt = now;
  }

  return patch;
};

export const syncOrderFromJetprint = async (
  order: OrderDocument,
): Promise<void> => {
  const orderNo = order.jetprintOrder?.orderNo;

  if (!orderNo) {
    return;
  }

  const jetprintOrder = await fetchJetprintOrder({ orderNo });
  const current = order.jetprintOrder ?? {};
  const status = jetprintOrder.orderStatus;
  const isCancelled = status === JETPRINT_ORDER_STATUS.cancelled;
  const now = new Date().toISOString();

  if (current.status !== status || (isCancelled && !current.cancelledAt)) {
    await updateOrderJetprintOrder(order.id, {
      status,
      ...(isCancelled && !current.cancelledAt ? { cancelledAt: now } : {}),
    });
  }

  const parcel = order.fulfillments?.find(
    (fulfillment) => fulfillment.source === "jetprint",
  );
  const parcelPatch = parcel
    ? buildParcelPatch(parcel, jetprintOrder, now)
    : {};

  if (parcel && Object.keys(parcelPatch).length > 0) {
    await updateOrderFulfillment(order.id, parcel.id, parcelPatch);
  }

  if (
    !JETPRINT_KNOWN_ORDER_STATUSES.includes(status) &&
    current.status !== status
  ) {
    console.warn(
      `JetPrint order ${orderNo} reports an unknown status ${status}`,
    );
    await notifyAdminJetprintUnknownStatus(order, status);
  }

  if (isCancelled) {
    if (!current.cancelledAt) {
      await notifyAdminJetprintOrderCancelled(order);
    }

    return;
  }

  const nextStatus = resolveNextJetprintOrderStatus(
    order.status,
    status,
    isJetprintOrderShipped(jetprintOrder),
  );

  const knownTrackingNumbers = new Set(
    getOrderTrackings(order)
      .filter((tracking) => tracking.source === "jetprint")
      .map((tracking) => tracking.number),
  );
  const hasNewTracking = parcelPatch.trackings?.some(
    (tracking) => !knownTrackingNumbers.has(tracking.number),
  );

  if (!nextStatus && !(order.status === "shipped" && hasNewTracking)) {
    return;
  }

  if (nextStatus) {
    await updateOrderStatus(order.id, nextStatus);
  }

  const updated = await findOrderById(order.id);

  if (updated) {
    await sendOrderStatusEmail(updated, nextStatus ? order.status : undefined);
  }
};

export type JetprintOrderSyncSummary = {
  synced: number;
  failed: { orderId: string; error: string }[];
  nextCursor: string | null;
};

export const syncJetprintOrders = async (
  cursor?: string,
): Promise<JetprintOrderSyncSummary> => {
  const submittedAfter = new Date(
    Date.now() - JETPRINT_SYNC_WINDOW_DAYS * DAY_MS,
  ).toISOString();
  const orders = await findOrdersAwaitingJetprint(submittedAfter, cursor);
  const deadline = Date.now() + JETPRINT_SYNC_BUDGET_MS;
  const failed: JetprintOrderSyncSummary["failed"] = [];
  let processed = 0;
  let synced = 0;
  let nextCursor: string | null = null;

  for (const order of orders) {
    if (processed > 0 && Date.now() >= deadline) {
      nextCursor = orders[processed - 1].id;
      break;
    }

    try {
      await syncOrderFromJetprint(order);
      synced += 1;
    } catch (error) {
      console.error(`JetPrint sync failed for order ${order.id}`, error);
      failed.push({ orderId: order.id, error: describeError(error) });
    }

    processed += 1;
  }

  return { synced, failed, nextCursor };
};
