"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { locales } from "@/i18n/config";
import {
  deleteAdminProduct,
  saveAdminProduct,
} from "@/server/admin/catalog.service";
import { parseAdminProductFormData } from "@/server/admin/form-data";
import { announceNewProduct } from "@/server/newsletter/services/newsletter.service";
import {
  AdminProductFormErrorCode,
  AdminProductFormMode,
} from "@/server/admin/product-form-state";
import { populateAdminProductIdentifiers } from "@/server/admin/product-identifiers";

import { requireAdmin } from "./shared";

const getAdminProductErrorRedirectPath = (
  formData: FormData,
  errorCode: AdminProductFormErrorCode,
) => {
  const rawFormMode = formData.get("formMode");
  const formMode =
    rawFormMode === AdminProductFormMode.Edit
      ? AdminProductFormMode.Edit
      : AdminProductFormMode.New;
  const rawProductId = formData.get("productId");
  const productId = typeof rawProductId === "string" ? rawProductId.trim() : "";

  if (formMode === AdminProductFormMode.Edit && productId) {
    return `/admin/products/${productId}/edit?error=${errorCode}`;
  }

  return `/admin/products/new?error=${errorCode}`;
};

const revalidateProductDependentPaths = (productSlug?: string) => {
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/favorites");

  if (productSlug) {
    revalidatePath(`/products/${productSlug}`);
  }

  for (const locale of locales) {
    if (locale === "en") {
      continue;
    }

    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/shop`);
    revalidatePath(`/${locale}/favorites`);

    if (productSlug) {
      revalidatePath(`/${locale}/products/${productSlug}`);
    }
  }
};

export const saveAdminProductAction = async (formData: FormData) => {
  await requireAdmin();

  let payload: ReturnType<typeof parseAdminProductFormData> | undefined;
  let errorCode: AdminProductFormErrorCode | undefined;
  let redirectPath: string | undefined;

  try {
    payload = parseAdminProductFormData(formData);
    payload = await populateAdminProductIdentifiers(payload);

    const saved = await saveAdminProduct(payload);
    const { status } = saved.product;
    if (status.isActive && status.visibleInShop && status.notifySubscribers) {
      void announceNewProduct(saved.product);
    }

    revalidateProductDependentPaths(payload.product.slug);
    redirectPath = `/admin/products/${payload.product.productId}/edit?saved=1`;
  } catch (error) {
    console.error("Admin product save failed", error);
    errorCode = AdminProductFormErrorCode.SaveFailed;
  }

  redirect(
    redirectPath ??
      getAdminProductErrorRedirectPath(
        formData,
        errorCode ?? AdminProductFormErrorCode.Unexpected,
      ),
  );
};

export const deleteAdminProductAction = async (formData: FormData) => {
  await requireAdmin();

  const rawProductId = formData.get("productId");
  const productId = typeof rawProductId === "string" ? rawProductId.trim() : "";
  let deletedProductSlug: string | undefined;

  try {
    const deletedProduct = await deleteAdminProduct(productId);
    deletedProductSlug = deletedProduct.slug;
  } catch (error) {
    console.error("Admin product delete failed", error);
    redirect(
      getAdminProductErrorRedirectPath(
        formData,
        AdminProductFormErrorCode.DeleteFailed,
      ),
    );
  }

  revalidateProductDependentPaths(deletedProductSlug);
  redirect("/admin/products?deleted=1");
};
