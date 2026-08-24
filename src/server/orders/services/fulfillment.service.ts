import "server-only";

import { orderStatusRank } from "@/constants/order";
import {
  PRINTIFY_CANCELLED_ORDER_STATUSES,
  PRINTIFY_ORDER_STATUS_MAP,
  PRINTIFY_QUIET_ORDER_STATUSES,
} from "@/constants/printify";
import { sendOrderStatusEmail } from "@/server/email/order-status-email";
import {
  findOrderById,
  findOrderByPrintifyOrderId,
  type OrderFulfillmentPatch,
  type OrderPrintifyInfoPatch,
  updateOrderFulfillment,
  updateOrderPrintifyOrder,
  updateOrderStatus,
} from "@/server/orders/repositories/orders.repository";
import {
  notifyAdminPrintifyOrderCancelled,
  notifyAdminPrintifyOrderFailed,
  notifyAdminPrintifyUnknownStatus,
} from "@/server/payments/telegram";
import {
  createPrintifyOrder,
  fetchPrintifyOrder,
} from "@/server/printify/services/printify-order.service";
import type {
  PrintifyOrderResponse,
  PrintifyShipment,
} from "@/server/printify/types";
import type {
  OrderDocument,
  OrderFulfillment,
  OrderPrintifyInfo,
  OrderStatus,
} from "@/types/order";

const describeError = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

export const submitOrderToPrintify = async (
  order: OrderDocument,
): Promise<void> => {
  if (order.printifyOrder) {
    return;
  }

  if (!order.items.some((item) => item.printify)) {
    return;
  }

  try {
    const printifyOrderId = await createPrintifyOrder(order);

    await updateOrderPrintifyOrder(order.id, {
      printifyOrderId,
      createdAt: new Date().toISOString(),
      lastError: null,
    });
  } catch (error) {
    const reason = describeError(error);

    console.error(`Failed to submit order ${order.id} to Printify`, error);

    await updateOrderPrintifyOrder(order.id, { lastError: reason }).catch(
      (updateError) =>
        console.error(
          `Failed to record the Printify error on order ${order.id}`,
          updateError,
        ),
    );

    await notifyAdminPrintifyOrderFailed(order, reason);
  }
};

const findPrintifyOrder = async (printifyOrder: PrintifyOrderResponse) => {
  const shopOrderId = printifyOrder.metadata?.shop_order_id;

  if (shopOrderId) {
    const byExternalId = await findOrderById(String(shopOrderId));

    if (byExternalId) {
      return byExternalId;
    }
  }

  return findOrderByPrintifyOrderId(printifyOrder.id);
};

const pickShipment = (
  printifyOrder: PrintifyOrderResponse,
): PrintifyShipment | undefined =>
  printifyOrder.shipments?.find((shipment) => shipment.number);

const buildPrintifyPatch = (
  current: OrderPrintifyInfo,
  printifyOrder: PrintifyOrderResponse,
  shipment: PrintifyShipment | undefined,
  isCancelled: boolean,
  now: string,
): OrderPrintifyInfoPatch => {
  const patch: OrderPrintifyInfoPatch = {};
  const hasStartedProduction =
    !isCancelled &&
    (Boolean(PRINTIFY_ORDER_STATUS_MAP[printifyOrder.status]) ||
      Boolean(shipment));

  if (printifyOrder.status && current.status !== printifyOrder.status) {
    patch.status = printifyOrder.status;
  }

  if (hasStartedProduction && !current.sentToProductionAt) {
    patch.sentToProductionAt = now;
  }

  if (isCancelled && !current.cancelledAt) {
    patch.cancelledAt = now;
  }

  return patch;
};

const buildParcelPatch = (
  current: OrderFulfillment | undefined,
  printifyOrder: PrintifyOrderResponse,
  shipment: PrintifyShipment | undefined,
  now: string,
): OrderFulfillmentPatch => {
  const patch: OrderFulfillmentPatch = {};

  const put = (key: keyof OrderFulfillmentPatch, value: string | undefined) => {
    if (value && current?.[key] !== value) {
      patch[key] = value;
    }
  };

  put("status", printifyOrder.status);
  put("carrier", shipment?.carrier);
  put("trackingNumber", shipment?.number);
  put("trackingUrl", shipment?.url);

  if (shipment && !current?.shippedAt) {
    patch.shippedAt = now;
  }

  if (shipment?.delivered_at && !current?.deliveredAt) {
    patch.deliveredAt = shipment.delivered_at;
  }

  return patch;
};

const resolveNextStatus = (
  order: OrderDocument,
  printifyOrder: PrintifyOrderResponse,
  shipment: PrintifyShipment | undefined,
): OrderStatus | undefined => {
  const mapped = PRINTIFY_ORDER_STATUS_MAP[printifyOrder.status];
  const candidate = shipment?.delivered_at
    ? "delivered"
    : (mapped ?? (shipment ? "shipped" : undefined));

  if (!candidate) {
    return undefined;
  }

  if (orderStatusRank[candidate] <= orderStatusRank[order.status]) {
    return undefined;
  }

  return candidate;
};

export const syncOrderFromPrintify = async (
  printifyOrderId: string,
): Promise<void> => {
  const printifyOrder = await fetchPrintifyOrder(printifyOrderId);
  const order = await findPrintifyOrder(printifyOrder);

  if (!order) {
    console.warn(`No order found for Printify order ${printifyOrder.id}`);
    return;
  }

  const current = order.printifyOrder ?? {};
  const parcel = order.fulfillments?.find(
    (fulfillment) => fulfillment.source === "printify",
  );
  const shipment = pickShipment(printifyOrder);
  const isCancelled = PRINTIFY_CANCELLED_ORDER_STATUSES.includes(
    printifyOrder.status,
  );

  const needsAttention =
    !isCancelled &&
    !PRINTIFY_ORDER_STATUS_MAP[printifyOrder.status] &&
    !PRINTIFY_QUIET_ORDER_STATUSES.includes(printifyOrder.status) &&
    current.status !== printifyOrder.status;

  const now = new Date().toISOString();
  const patch = buildPrintifyPatch(
    current,
    printifyOrder,
    shipment,
    isCancelled,
    now,
  );
  const parcelPatch = buildParcelPatch(parcel, printifyOrder, shipment, now);

  if (Object.keys(patch).length > 0) {
    await updateOrderPrintifyOrder(order.id, patch);
  }

  if (parcel && Object.keys(parcelPatch).length > 0) {
    await updateOrderFulfillment(order.id, parcel.id, parcelPatch);
  }

  if (needsAttention) {
    console.warn(
      `Printify order ${printifyOrder.id} reports an unmapped status "${printifyOrder.status}"`,
    );
    await notifyAdminPrintifyUnknownStatus(order, printifyOrder.status);
  }

  if (isCancelled && !current.cancelledAt) {
    await notifyAdminPrintifyOrderCancelled(order, printifyOrder.status);
    return;
  }

  const nextStatus = isCancelled
    ? undefined
    : resolveNextStatus(order, printifyOrder, shipment);

  if (!nextStatus) {
    return;
  }

  await updateOrderStatus(order.id, nextStatus);

  const updated = await findOrderById(order.id);

  if (updated) {
    await sendOrderStatusEmail(updated, order.status);
  }
};
