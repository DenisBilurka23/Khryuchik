"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  deleteOrder,
  updateOrderStatus,
} from "@/server/orders/repositories/orders.repository";
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
    await updateOrderStatus(orderId, status);
  } catch (error) {
    console.error("updateAdminOrderStatusAction failed", error);
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
