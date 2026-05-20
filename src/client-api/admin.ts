import type { Locale } from "@/i18n/config";
import type { ProductImage } from "@/types/product-details";

import { GET, POST } from "@/client-api";

type AdminProductSearchItem = {
  id: string;
  title: string;
  slug: string;
};

export type AdminProductSearchResponse = {
  items?: AdminProductSearchItem[];
};

export const searchAdminProductsClient = async (params: {
  locale: Locale;
  query: string;
  excludeProductId?: string;
  limit?: number;
}) => {
  const searchParams = new URLSearchParams({
    locale: params.locale,
    q: params.query,
    limit: String(params.limit ?? 10),
  });

  if (params.excludeProductId) {
    searchParams.set("excludeProductId", params.excludeProductId);
  }

  return GET<AdminProductSearchResponse>(
    `/api/admin/products/search?${searchParams.toString()}`,
  );
};

export type AdminProductUploadFileInput = {
  fileName: string;
  contentType: string;
};

export type AdminProductGalleryUploadPlan = {
  id: string;
  objectKey: string;
  uploadUrl: string;
  contentType: string;
  expiresInSeconds: number;
  image: ProductImage;
};

export type AdminProductAssetUploadPlan = {
  id: string;
  objectKey: string;
  uploadUrl: string;
  contentType: string;
  expiresInSeconds: number;
  fileName: string;
  format: string;
};

type AdminProductUploadKind = "gallery" | "asset";

type AdminProductUploadResponse<TPlan> = {
  items?: TPlan[];
  error?: string;
};

export const requestAdminProductGalleryUploadUrls = (params: {
  locale: Locale;
  productId?: string;
  files: AdminProductUploadFileInput[];
}) =>
  POST<AdminProductUploadResponse<AdminProductGalleryUploadPlan>>(
    "/api/admin/products/uploads",
    {
      kind: "gallery" satisfies AdminProductUploadKind,
      locale: params.locale,
      productId: params.productId,
      files: params.files,
    },
  );

export const requestAdminProductAssetUploadUrls = (params: {
  locale: Locale;
  productId?: string;
  files: AdminProductUploadFileInput[];
}) =>
  POST<AdminProductUploadResponse<AdminProductAssetUploadPlan>>(
    "/api/admin/products/uploads",
    {
      kind: "asset" satisfies AdminProductUploadKind,
      locale: params.locale,
      productId: params.productId,
      files: params.files,
    },
  );