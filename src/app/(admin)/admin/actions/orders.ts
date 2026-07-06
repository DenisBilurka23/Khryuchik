"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteOrder,
  findOrderById,
  updateOrderPayment,
  updateOrderStatus,
} from "@/server/orders/repositories/orders.repository";
import { sendOrderConfirmationEmail } from "@/server/email/order-confirmation";
import { sendOrderShippedEmail } from "@/server/email/order-shipped";
import { requireAdminApiAccess } from "@/server/admin/auth";
import type { OrderStatus } from "@/types/order";
import { isOrderStatus } from "@/utils";

type UpdateOrderStatusResult =
  | { ok: true }
  | { ok: false; error: "unauthorized" | "invalid_status" | "failed" };

const revalidateOrderDependentPaths = () => {
  revalidatePath("/admin/orders");
  revalidatePath("/admin/customers/[id]", "page");
};

export const updateAdminOrderStatusAction = async (
  orderId: string,
  status: OrderStatus,
): Promise<UpdateOrderStatusResult> => {
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

    if (status === "shipped" && previous?.status !== "shipped") {
      const updated = await findOrderById(orderId);
      if (updated) {
        void sendOrderShippedEmail(updated);
      }
    }
  } catch (error) {
    console.error("updateAdminOrderStatusAction failed", error);
    return { ok: false, error: "failed" };
  }

  revalidateOrderDependentPaths();
  return { ok: true };
};

type ConfirmOrderPaymentResult =
  | { ok: true }
  | { ok: false; error: "unauthorized" | "failed" };

export const confirmAdminOrderPaymentAction = async (
  orderId: string,
): Promise<ConfirmOrderPaymentResult> => {
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
