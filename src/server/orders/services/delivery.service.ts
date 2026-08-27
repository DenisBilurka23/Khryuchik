import "server-only";

import { orderStatusRank } from "@/constants/order";
import { sendOrderStatusEmail } from "@/server/email/order-status-email";
import {
  findOrderById,
  findOrdersWithOpenParcels,
  type OrderFulfillmentPatch,
  updateOrderFulfillment,
  updateOrderStatus,
} from "@/server/orders/repositories/orders.repository";
import { findShippingProvider } from "@/server/shipping/providers/registry";
import type {
  OrderDeliveredBy,
  OrderDocument,
  OrderFulfillment,
} from "@/types/order";
import type { ShippingProgress } from "@/types/shipping";
import { canConfirmOrderDelivery, normalizeOrderEmail } from "@/utils";

export type ParcelProgressSummary = {
  status: "ok";
  orders: number;
  asked: number;
  delivered: number;
  moving: number;
  silent: number;
  failed: number;
};

const isOpenParcel = (fulfillment: OrderFulfillment) =>
  Boolean(fulfillment.labelExternalId) && !fulfillment.deliveredAt;

const areAllParcelsDelivered = (order: OrderDocument) =>
  Boolean(order.fulfillments?.length) &&
  (order.fulfillments ?? []).every((fulfillment) =>
    Boolean(fulfillment.deliveredAt),
  );

export const settleOrderDelivery = async (orderId: string): Promise<void> => {
  const order = await findOrderById(orderId);

  if (!order || !areAllParcelsDelivered(order)) {
    return;
  }

  if (orderStatusRank.delivered <= orderStatusRank[order.status]) {
    return;
  }

  await updateOrderStatus(orderId, "delivered");

  const updated = await findOrderById(orderId);

  if (updated) {
    await sendOrderStatusEmail(updated, order.status);
  }
};

export const markParcelDelivered = async (
  orderId: string,
  parcelId: string,
  deliveredBy: OrderDeliveredBy,
  deliveredAt: string = new Date().toISOString(),
): Promise<void> => {
  await updateOrderFulfillment(orderId, parcelId, {
    deliveredAt,
    deliveredBy,
    lastError: null,
  });

  await settleOrderDelivery(orderId);
};

// The customer confirms the whole order — they cannot tell one parcel from
// another — so every parcel still open gets the mark.
export const markOrderDelivered = async (
  order: OrderDocument,
  deliveredBy: OrderDeliveredBy,
): Promise<void> => {
  const deliveredAt = new Date().toISOString();

  for (const fulfillment of order.fulfillments ?? []) {
    if (fulfillment.deliveredAt) {
      continue;
    }

    await updateOrderFulfillment(order.id, fulfillment.id, {
      deliveredAt,
      deliveredBy,
    });
  }

  await settleOrderDelivery(order.id);
};

export type CustomerDeliveryConfirmation =
  | { status: "ok" }
  | { status: "unknown_order" }
  | { status: "not_confirmable" };

const ownsOrder = (
  order: OrderDocument,
  owner: { userId?: string; email?: string },
) =>
  (Boolean(owner.userId) && order.userId === owner.userId) ||
  (Boolean(owner.email) &&
    normalizeOrderEmail(order.customer.email) ===
      normalizeOrderEmail(owner.email ?? ""));

export const confirmOrderDeliveryByCustomer = async (
  orderId: string,
  owner: { userId?: string; email?: string },
): Promise<CustomerDeliveryConfirmation> => {
  const order = await findOrderById(orderId);

  if (!order || !ownsOrder(order, owner)) {
    return { status: "unknown_order" };
  }

  if (!canConfirmOrderDelivery(order)) {
    return { status: "not_confirmable" };
  }

  await markOrderDelivered(order, "customer");

  return { status: "ok" };
};

const buildProgressPatch = (
  fulfillment: OrderFulfillment,
  progress: ShippingProgress,
): OrderFulfillmentPatch => {
  if (progress.status === "failed") {
    return fulfillment.lastError === progress.reason
      ? {}
      : { lastError: progress.reason };
  }

  const patch: OrderFulfillmentPatch = {};

  const put = <Key extends keyof OrderFulfillmentPatch>(
    key: Key,
    value: OrderFulfillmentPatch[Key],
  ) => {
    if (value && fulfillment[key] !== value) {
      patch[key] = value;
    }
  };

  put("carrier", progress.carrier);
  put("trackingNumber", progress.trackingNumber);
  put("trackingUrl", progress.trackingUrl);

  if (progress.status === "delivered") {
    patch.deliveredAt = progress.deliveredAt;
    patch.deliveredBy = "carrier";
  }

  if (fulfillment.lastError) {
    patch.lastError = null;
  }

  return patch;
};

const readParcelProgress = async (
  fulfillment: OrderFulfillment,
): Promise<ShippingProgress | null> => {
  const provider = findShippingProvider(fulfillment.provider);

  if (!provider?.readProgress || !fulfillment.labelExternalId) {
    return null;
  }

  return provider.readProgress(fulfillment.labelExternalId);
};

export const syncParcelProgress = async (): Promise<ParcelProgressSummary> => {
  const orders = await findOrdersWithOpenParcels();

  let asked = 0;
  let delivered = 0;
  let moving = 0;
  let silent = 0;
  let failed = 0;

  for (const order of orders) {
    let touched = false;

    for (const fulfillment of (order.fulfillments ?? []).filter(isOpenParcel)) {
      const progress = await readParcelProgress(fulfillment);

      if (!progress) {
        continue;
      }

      asked += 1;

      if (progress.status === "failed") {
        failed += 1;
        console.error(
          `Could not read progress for parcel ${fulfillment.id} of order ${order.id}: ${progress.reason}`,
        );
      } else if (progress.status === "delivered") {
        delivered += 1;
      } else if (progress.status === "in-transit") {
        moving += 1;
      } else {
        silent += 1;
      }

      const patch = buildProgressPatch(fulfillment, progress);

      if (Object.keys(patch).length > 0) {
        await updateOrderFulfillment(order.id, fulfillment.id, patch);
        touched = true;
      }
    }

    if (touched) {
      await settleOrderDelivery(order.id);
    }
  }

  return {
    status: "ok",
    orders: orders.length,
    asked,
    delivered,
    moving,
    silent,
    failed,
  };
};
