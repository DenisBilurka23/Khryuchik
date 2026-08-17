"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminApiAccess } from "@/server/admin/auth";
import {
  importPrintifyProduct,
  PrintifyImportError,
  type PrintifyImportErrorCode,
  relinkPrintifyProduct,
  syncPrintifyProduct,
} from "@/server/printify/services/printify-catalog.service";

import { requireAdmin } from "./shared";
import type { AdminActionResult } from "./types";

const readProductId = (formData: FormData, key: string) => {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
};

const revalidatePrintifyPaths = (productId?: string) => {
  revalidatePath("/admin/products");
  revalidatePath("/admin/products/printify");

  if (productId) {
    revalidatePath(`/admin/products/${productId}/edit`);
  }
};

export const importPrintifyProductAction = async (formData: FormData) => {
  await requireAdmin();

  const printifyProductId = readProductId(formData, "printifyProductId");

  if (!printifyProductId) {
    redirect("/admin/products/printify?error=invalid-request");
  }

  let importedProductId: string | undefined;

  try {
    const imported = await importPrintifyProduct(printifyProductId);
    importedProductId = imported.productId;
  } catch (error) {
    console.error("Printify import failed", error);

    const code =
      error instanceof PrintifyImportError ? error.code : "import-failed";

    redirect(`/admin/products/printify?error=${code}`);
  }

  revalidatePrintifyPaths(importedProductId);
  redirect(`/admin/products/${importedProductId}/edit?imported=1`);
};

export const syncPrintifyProductAction = async (
  productId: string,
): Promise<AdminActionResult<PrintifyImportErrorCode>> => {
  // Called from a click handler, so an unauthorised caller gets a message
  // rather than the redirect `requireAdmin` would throw.
  const session = await requireAdminApiAccess();

  if (!session) {
    return { ok: false, error: "unauthorized" };
  }

  try {
    await syncPrintifyProduct(productId);
  } catch (error) {
    console.error("Printify sync failed", error);

    return {
      ok: false,
      error: error instanceof PrintifyImportError ? error.code : "failed",
    };
  }

  revalidatePrintifyPaths(productId);

  return { ok: true };
};

export const relinkPrintifyProductAction = async (
  productId: string,
): Promise<AdminActionResult<PrintifyImportErrorCode>> => {
  // Called from a click handler, so an unauthorised caller gets a message
  // rather than the redirect `requireAdmin` would throw.
  const session = await requireAdminApiAccess();

  if (!session) {
    return { ok: false, error: "unauthorized" };
  }

  try {
    await relinkPrintifyProduct(productId);
  } catch (error) {
    console.error("Printify relink failed", error);

    return {
      ok: false,
      error: error instanceof PrintifyImportError ? error.code : "failed",
    };
  }

  revalidatePrintifyPaths(productId);

  return { ok: true };
};
