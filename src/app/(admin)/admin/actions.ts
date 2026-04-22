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
import { populateAdminProductIdentifiers } from "@/server/admin/product-identifiers";
import { requireAdminApiAccess } from "@/server/admin/auth";
import { uploadBookFiles, uploadProductGalleryFiles } from "@/server/storage/r2-assets.service";
import { isR2Configured } from "@/server/storage/r2";
import type { ProductImage } from "@/types/product-details";

type ImageOrderEntry = {
  id: string;
  kind: "existing" | "new";
};

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

const parseImageOrder = (formData: FormData, key: string): ImageOrderEntry[] => {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((entry): entry is ImageOrderEntry => {
      if (!entry || typeof entry !== "object") {
        return false;
      }

      const candidate = entry as Partial<ImageOrderEntry>;

      return (
        typeof candidate.id === "string" &&
        (candidate.kind === "existing" || candidate.kind === "new")
      );
    });
  } catch {
    return [];
  }
};

const mergeOrderedImages = ({
  existingImages,
  uploadedImages,
  imageOrder,
}: {
  existingImages: ProductImage[];
  uploadedImages: ProductImage[];
  imageOrder: ImageOrderEntry[];
}) => {
  if (imageOrder.length === 0) {
    return [...existingImages, ...uploadedImages];
  }

  const existingImagesById = new Map(
    existingImages.map((image) => [image.id, image]),
  );
  const remainingUploadedImages = [...uploadedImages];
  const orderedImages: ProductImage[] = [];

  imageOrder.forEach((entry) => {
    if (entry.kind === "existing") {
      const existingImage = existingImagesById.get(entry.id);

      if (existingImage) {
        orderedImages.push(existingImage);
        existingImagesById.delete(entry.id);
      }

      return;
    }

    const nextUploadedImage = remainingUploadedImages.shift();

    if (nextUploadedImage) {
      orderedImages.push(nextUploadedImage);
    }
  });

  return [
    ...orderedImages,
    ...existingImagesById.values(),
    ...remainingUploadedImages,
  ];
};

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
    payload = await populateAdminProductIdentifiers(payload);

    for (const locale of locales) {
      const galleryFiles = getUploadedFiles(formData, `gallery${locale.toUpperCase()}`);
      const assetFiles = getUploadedFiles(formData, `digitalAssets${locale.toUpperCase()}`);
      const imageOrder = parseImageOrder(formData, `${locale}.imagesOrderJson`);

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

      let uploadedImages: ProductImage[] = [];

      if (galleryFiles.length > 0) {
        uploadedImages = await uploadProductGalleryFiles({
          productId: payload.product.productId,
          locale,
          files: galleryFiles,
        });
      }

      payload.details.translations[locale].images = mergeOrderedImages({
        existingImages: payload.details.translations[locale].images,
        uploadedImages,
        imageOrder,
      });

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