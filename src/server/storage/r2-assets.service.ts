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

type UploadableBinary = Blob & {
  name?: string;
};

const getUploadFileName = (file: UploadableBinary, fallbackBaseName: string) => {
  const rawName = typeof file.name === "string" ? file.name.trim() : "";

  if (rawName) {
    return rawName;
  }

  const extension = file.type === "image/png"
    ? "png"
    : file.type === "image/jpeg"
      ? "jpg"
      : file.type === "image/webp"
        ? "webp"
        : "bin";

  return `${fallbackBaseName}.${extension}`;
};

export const uploadProductGalleryFiles = async ({
  productId,
  locale,
  files,
}: {
  productId: string;
  locale: Locale;
  files: UploadableBinary[];
}): Promise<ProductImage[]> => {
  return await Promise.all(
    files
      .filter((file) => file.size > 0)
      .map(async (file) => {
        const fileName = getUploadFileName(file, "gallery-image");
        const objectKey = `products/${productId}/${locale}/gallery/${randomUUID()}-${sanitizeFileName(fileName)}`;
        const uploaded = await uploadPublicObject({ objectKey, file });

        return {
          id: randomUUID(),
          src: uploaded.url,
          objectKey: uploaded.objectKey,
          alt: fileName,
          bgColor: "#FFF8F0",
        } satisfies ProductImage;
      }),
  );
};

export const uploadUserAvatarFile = async ({
  userId,
  file,
}: {
  userId: string;
  file: UploadableBinary;
}) => {
  const fileName = getUploadFileName(file, "avatar");
  const objectKey = `users/${userId}/avatar/${randomUUID()}-${sanitizeFileName(fileName)}`;
  const uploaded = await uploadPublicObject({ objectKey, file });

  return {
    objectKey: uploaded.objectKey,
    url: uploaded.url,
  };
};

export const uploadBookFiles = async ({
  productId,
  locale,
  files,
}: {
  productId: string;
  locale: Locale;
  files: UploadableBinary[];
}): Promise<ProductFileAsset[]> => {
  return await Promise.all(
    files
      .filter((file) => file.size > 0)
      .map(async (file) => {
        const fileName = getUploadFileName(file, "book-file");
        const objectKey = `books/${productId}/${locale}/${randomUUID()}-${sanitizeFileName(fileName)}`;
        const uploaded = await uploadPrivateObject({ objectKey, file });

        return {
          id: randomUUID(),
          label: fileName,
          fileName,
          format: getFileExtension(fileName),
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

export const deleteUserAvatarObject = async (objectKey?: string | null) => {
  if (!objectKey) {
    return;
  }

  await deletePublicObject(objectKey);
};
