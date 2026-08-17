"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteOrder,
  findOrderById,
  updateOrderPayment,
  updateOrderPrintifyOrder,
  updateOrderStatus,
} from "@/server/orders/repositories/orders.repository";
import { sendPrintifyOrderToProduction } from "@/server/printify/services/printify-order.service";
import { sendOrderConfirmationEmail } from "@/server/email/order-confirmation";
import { sendOrderStatusEmail } from "@/server/email/order-status-email";
import { requireAdminApiAccess } from "@/server/admin/auth";
import type { OrderStatus } from "@/types/order";
import { isOrderStatus } from "@/utils";

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
        sendOrderStatusEmail(updated, previous.status);
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
      void sendOrderConfirmationEmail(updated);
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
    await deleteOrder(orderId);
  } catch (error) {
    console.error("deleteAdminOrderAction failed", error);
    return;
  }

  revalidateOrderDependentPaths();
};
