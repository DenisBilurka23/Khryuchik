"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { locales } from "@/i18n/config";
import { saveAdminCategory, saveAdminProduct } from "@/server/admin/catalog.service";
import {
  parseAdminCategoryFormData,
  parseAdminProductFormData,
} from "@/server/admin/form-data";
import {
  AdminProductFormErrorCode,
  AdminProductFormMode,
} from "@/server/admin/product-form-state";
import { requireAdminApiAccess } from "@/server/admin/auth";
import { uploadBookFiles, uploadProductGalleryFiles } from "@/server/storage/r2-assets.service";
import { isR2Configured } from "@/server/storage/r2";

const requireAdmin = async () => {
  const session = await requireAdminApiAccess();

  if (!session) {
    redirect("/login?callbackUrl=%2Fadmin");
  }
};

const getUploadedFiles = (formData: FormData, key: string) =>
  formData
    .getAll(key)
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

const getAdminProductErrorRedirectPath = (
  formData: FormData,
  errorCode: AdminProductFormErrorCode,
) => {
  const rawFormMode = formData.get("formMode");
  const formMode = rawFormMode === AdminProductFormMode.Edit
    ? AdminProductFormMode.Edit
    : AdminProductFormMode.New;
  const rawProductId = formData.get("productId");
  const productId = typeof rawProductId === "string" ? rawProductId.trim() : "";

  if (formMode === AdminProductFormMode.Edit && productId) {
    return `/admin/products/${productId}/edit?error=${errorCode}`;
  }

  return `/admin/products/new?error=${errorCode}`;
};

export const saveAdminCategoryAction = async (formData: FormData) => {
  await requireAdmin();

  const input = parseAdminCategoryFormData(formData);

  await saveAdminCategory(input);

  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  redirect("/admin/categories?saved=1");
};

export const saveAdminProductAction = async (formData: FormData) => {
  await requireAdmin();

  let payload: ReturnType<typeof parseAdminProductFormData> | undefined;
  let errorCode: AdminProductFormErrorCode | undefined;
  let redirectPath: string | undefined;

  try {
    payload = parseAdminProductFormData(formData);

    for (const locale of locales) {
      const galleryFiles = getUploadedFiles(formData, `gallery${locale.toUpperCase()}`);
      const assetFiles = getUploadedFiles(formData, `digitalAssets${locale.toUpperCase()}`);

      if ((galleryFiles.length > 0 || assetFiles.length > 0) && !isR2Configured) {
        console.error("Admin product save failed: R2 is not configured", {
          productId: payload.product.productId,
          locale,
          galleryFiles: galleryFiles.length,
          assetFiles: assetFiles.length,
        });

        errorCode = AdminProductFormErrorCode.StorageUnavailable;
        break;
      }

      if (galleryFiles.length > 0) {
        const uploadedImages = await uploadProductGalleryFiles({
          productId: payload.product.productId,
          locale,
          files: galleryFiles,
        });

        payload.details.translations[locale].images = [
          ...payload.details.translations[locale].images,
          ...uploadedImages,
        ];
      }

      if (assetFiles.length > 0) {
        const uploadedAssets = await uploadBookFiles({
          productId: payload.product.productId,
          locale,
          files: assetFiles,
        });

        payload.details.translations[locale].digitalAssets = [
          ...(payload.details.translations[locale].digitalAssets ?? []),
          ...uploadedAssets,
        ];
      }
    }

    if (!errorCode) {
      await saveAdminProduct(payload);

      revalidatePath("/admin");
      revalidatePath("/admin/products");
      redirectPath = `/admin/products/${payload.product.productId}/edit?saved=1`;
    }
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