"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteOrder,
  findOrderById,
  updateOrderFulfillment,
  updateOrderPayment,
  updateOrderPrintifyOrder,
  updateOrderStatus,
} from "@/server/orders/repositories/orders.repository";
import {
  cancelPrintifyOrder,
  sendPrintifyOrderToProduction,
} from "@/server/printify/services/printify-order.service";
import { sendOrderConfirmationEmail } from "@/server/email/order-confirmation";
import { sendOrderStatusEmail } from "@/server/email/order-status-email";
import { requireAdminApiAccess } from "@/server/admin/auth";
import { markParcelDelivered } from "@/server/orders/services/delivery.service";
import { applyStripeRefund } from "@/server/orders/services/orders.service";
import { buyOrderLabel } from "@/server/orders/services/shipping-label.service";
import { refundStripePayment } from "@/server/payments/stripe";
import type { OrderStatus } from "@/types/order";
import {
  asOptionalString,
  hasLivePrintifyOrder,
  isOrderStatus,
  isRefundableOrder,
} from "@/utils";

import type { AdminActionResult } from "./types";

const revalidateOrderDependentPaths = () => {
  revalidatePath("/admin/orders");
  revalidatePath("/admin/customers/[id]", "page");
};

export const updateAdminOrderStatusAction = async (
  orderId: string,
  status: OrderStatus,
): Promise<AdminActionResult<"invalid_status">> => {
  const session = await requireAdminApiAccess();
  if (!session) {
    return { ok: false, error: "unauthorized" };
  }

  if (!isOrderStatus(status)) {
    return { ok: false, error: "invalid_status" };
  }

  try {
    const previous = await findOrderById(orderId);
    await updateOrderStatus(orderId, status);

    if (previous && previous.status !== status) {
      const updated = await findOrderById(orderId);
      if (updated) {
        await sendOrderStatusEmail(updated, previous.status);
      }
    }
  } catch (error) {
    console.error("updateAdminOrderStatusAction failed", error);
    return { ok: false, error: "failed" };
  }

  revalidateOrderDependentPaths();
  return { ok: true };
};

export const confirmAdminOrderPaymentAction = async (
  orderId: string,
): Promise<AdminActionResult> => {
  const session = await requireAdminApiAccess();
  if (!session) {
    return { ok: false, error: "unauthorized" };
  }

  try {
    const order = await findOrderById(orderId);
    await updateOrderPayment(orderId, {
      status: "paid",
      paidAt: new Date().toISOString(),
    });
    if (order?.fulfillmentType === "digital") {
      await updateOrderStatus(orderId, "delivered");
    }

    const updated = await findOrderById(orderId);
    if (updated) {
      await sendOrderConfirmationEmail(updated);
    }
  } catch (error) {
    console.error("confirmAdminOrderPaymentAction failed", error);
    return { ok: false, error: "failed" };
  }

  revalidateOrderDependentPaths();
  return { ok: true };
};

export const sendAdminOrderToProductionAction = async (
  orderId: string,
): Promise<AdminActionResult<"not_submitted">> => {
  const session = await requireAdminApiAccess();
  if (!session) {
    return { ok: false, error: "unauthorized" };
  }

  const order = await findOrderById(orderId);
  const printifyOrderId = order?.printifyOrder?.printifyOrderId;

  if (!printifyOrderId) {
    return { ok: false, error: "not_submitted" };
  }

  if (order?.printifyOrder?.sentToProductionAt) {
    return { ok: true };
  }

  try {
    await sendPrintifyOrderToProduction(printifyOrderId);
    await updateOrderPrintifyOrder(orderId, {
      sentToProductionAt: new Date().toISOString(),
      lastError: null,
    });
  } catch (error) {
    console.error("sendAdminOrderToProductionAction failed", error);
    await updateOrderPrintifyOrder(orderId, {
      lastError: error instanceof Error ? error.message : String(error),
    }).catch(() => undefined);
    revalidateOrderDependentPaths();
    return { ok: false, error: "failed" };
  }

  revalidateOrderDependentPaths();
  return { ok: true };
};

export const cancelAdminOrderPrintifyAction = async (
  orderId: string,
): Promise<AdminActionResult<"not_submitted">> => {
  const session = await requireAdminApiAccess();
  if (!session) {
    return { ok: false, error: "unauthorized" };
  }

  const order = await findOrderById(orderId);
  const printifyOrderId = order?.printifyOrder?.printifyOrderId;

  if (!printifyOrderId) {
    return { ok: false, error: "not_submitted" };
  }

  if (order?.printifyOrder?.cancelledAt) {
    return { ok: true };
  }

  try {
    await cancelPrintifyOrder(printifyOrderId);
    await updateOrderPrintifyOrder(orderId, {
      cancelledAt: new Date().toISOString(),
      cancelError: null,
    });
  } catch (error) {
    console.error("cancelAdminOrderPrintifyAction failed", error);
    await updateOrderPrintifyOrder(orderId, {
      cancelError: error instanceof Error ? error.message : String(error),
    }).catch(() => undefined);
    revalidateOrderDependentPaths();
    return { ok: false, error: "failed" };
  }

  revalidateOrderDependentPaths();
  return { ok: true };
};

export type AdminOrderTrackingInput = {
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
};

export const saveAdminOrderTrackingAction = async (
  orderId: string,
  fulfillmentId: string,
  input: AdminOrderTrackingInput,
): Promise<AdminActionResult<"unknown_parcel">> => {
  const session = await requireAdminApiAccess();
  if (!session) {
    return { ok: false, error: "unauthorized" };
  }

  const order = await findOrderById(orderId);
  const parcel = order?.fulfillments?.find(
    (fulfillment) => fulfillment.id === fulfillmentId,
  );

  if (!parcel || parcel.source !== "manual") {
    return { ok: false, error: "unknown_parcel" };
  }

  const trackingNumber = asOptionalString(input.trackingNumber);

  try {
    await updateOrderFulfillment(orderId, fulfillmentId, {
      carrier: asOptionalString(input.carrier) ?? null,
      trackingNumber: trackingNumber ?? null,
      trackingUrl: asOptionalString(input.trackingUrl) ?? null,
      ...(trackingNumber && !parcel.shippedAt
        ? { shippedAt: new Date().toISOString() }
        : {}),
    });
  } catch (error) {
    console.error("saveAdminOrderTrackingAction failed", error);
    return { ok: false, error: "failed" };
  }

  revalidateOrderDependentPaths();
  return { ok: true };
};

export const markAdminOrderParcelDeliveredAction = async (
  orderId: string,
  fulfillmentId: string,
): Promise<AdminActionResult<"unknown_parcel" | "already_delivered">> => {
  const session = await requireAdminApiAccess();
  if (!session) {
    return { ok: false, error: "unauthorized" };
  }

  const order = await findOrderById(orderId);
  const parcel = order?.fulfillments?.find(
    (fulfillment) => fulfillment.id === fulfillmentId,
  );

  if (!parcel) {
    return { ok: false, error: "unknown_parcel" };
  }

  if (parcel.deliveredAt) {
    return { ok: false, error: "already_delivered" };
  }

  try {
    await markParcelDelivered(orderId, fulfillmentId, "admin");
  } catch (error) {
    console.error("markAdminOrderParcelDeliveredAction failed", error);
    return { ok: false, error: "failed" };
  }

  revalidateOrderDependentPaths();
  return { ok: true };
};

export const buyAdminOrderLabelAction = async (
  orderId: string,
  fulfillmentId: string,
): Promise<
  AdminActionResult<
    | "unknown_parcel"
    | "unsupported"
    | "already_tracked"
    | "missing_parcel"
    | "missing_address"
  >
> => {
  const session = await requireAdminApiAccess();
  if (!session) {
    return { ok: false, error: "unauthorized" };
  }

  const order = await findOrderById(orderId);

  if (!order) {
    return { ok: false, error: "unknown_parcel" };
  }

  const result = await buyOrderLabel(order, fulfillmentId);

  revalidateOrderDependentPaths();

  if (result.status === "ok") {
    return { ok: true };
  }

  return {
    ok: false,
    error: result.status === "failed" ? "failed" : result.status,
  };
};

export const refundAdminOrderPaymentAction = async (
  orderId: string,
): Promise<AdminActionResult<"not_refundable">> => {
  const session = await requireAdminApiAccess();
  if (!session) {
    return { ok: false, error: "unauthorized" };
  }

  const order = await findOrderById(orderId);
  const paymentIntentId = order?.payment.stripePaymentIntentId;

  if (!order || !paymentIntentId || !isRefundableOrder(order)) {
    return { ok: false, error: "not_refundable" };
  }

  try {
    const refund = await refundStripePayment(paymentIntentId, order.id);

    await applyStripeRefund(order.id, {
      amountRefundedMinor: refund.amount,
      isFullyRefunded: true,
      refundId: refund.id,
    });
  } catch (error) {
    console.error("refundAdminOrderPaymentAction failed", error);
    return { ok: false, error: "failed" };
  }

  revalidateOrderDependentPaths();
  return { ok: true };
};

export const deleteAdminOrderAction = async (formData: FormData) => {
  const session = await requireAdminApiAccess();
  if (!session) {
    redirect("/login?callbackUrl=%2Fadmin%2Forders");
  }

  const orderId = formData.get("orderId");
  if (typeof orderId !== "string" || orderId.length === 0) {
    return;
  }

  try {
    const order = await findOrderById(orderId);

    if (order && hasLivePrintifyOrder(order)) {
      console.warn(
        `Refused to delete order ${orderId}: its Printify order is still live`,
      );
      return;
    }

    await deleteOrder(orderId);
  } catch (error) {
    console.error("deleteAdminOrderAction failed", error);
    return;
  }

  revalidateOrderDependentPaths();
};
