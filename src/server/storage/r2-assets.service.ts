import "server-only";

import { randomUUID } from "crypto";

import type { Locale } from "@/i18n/config";
import type { ProductFileAsset, ProductImage } from "@/types/product-details";

import {
  deletePrivateObject,
  deletePublicObject,
  uploadPrivateObject,
  uploadPublicObject,
} from "./r2";

const sanitizeFileName = (fileName: string) =>
  fileName
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

const getFileExtension = (fileName: string) => {
  const extension = fileName.split(".").pop();

  return extension ? extension.toLowerCase() : "bin";
};

export const uploadProductGalleryFiles = async ({
  productId,
  locale,
  files,
}: {
  productId: string;
  locale: Locale;
  files: File[];
}): Promise<ProductImage[]> => {
  return await Promise.all(
    files
      .filter((file) => file.size > 0)
      .map(async (file) => {
        const objectKey = `products/${productId}/${locale}/gallery/${randomUUID()}-${sanitizeFileName(file.name)}`;
        const uploaded = await uploadPublicObject({ objectKey, file });

        return {
          id: randomUUID(),
          src: uploaded.url,
          objectKey: uploaded.objectKey,
          alt: file.name,
          bgColor: "#FFF8F0",
        } satisfies ProductImage;
      }),
  );
};

export const uploadBookFiles = async ({
  productId,
  locale,
  files,
}: {
  productId: string;
  locale: Locale;
  files: File[];
}): Promise<ProductFileAsset[]> => {
  return await Promise.all(
    files
      .filter((file) => file.size > 0)
      .map(async (file) => {
        const objectKey = `books/${productId}/${locale}/${randomUUID()}-${sanitizeFileName(file.name)}`;
        const uploaded = await uploadPrivateObject({ objectKey, file });

        return {
          id: randomUUID(),
          label: file.name,
          fileName: file.name,
          format: getFileExtension(file.name),
          contentType: file.type,
          sizeBytes: file.size,
          objectKey: uploaded.objectKey,
        } satisfies ProductFileAsset;
      }),
  );
};

export const deleteProductGalleryObjects = async (objectKeys: string[]) => {
  await Promise.all(
    objectKeys.filter(Boolean).map(async (objectKey) => {
      await deletePublicObject(objectKey);
    }),
  );
};

export const deleteBookAssetObjects = async (objectKeys: string[]) => {
  await Promise.all(
    objectKeys.filter(Boolean).map(async (objectKey) => {
      await deletePrivateObject(objectKey);
    }),
  );
};
