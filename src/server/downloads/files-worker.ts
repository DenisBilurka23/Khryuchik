import "server-only";

import { SIGNED_FILE_LINK_TTL_SECONDS } from "@/constants/storage";
import type { SignedFileBucket } from "@/types/download";
import { createSignedFileUrl } from "@/utils";

import type { PurchasedAsset } from "./downloads.service";

export const getFilesWorkerConfig = () => {
  const baseUrl = process.env.FILES_BASE_URL?.trim();
  const secret = process.env.FILES_SIGNING_SECRET?.trim();

  return baseUrl && secret ? { baseUrl, secret } : null;
};

export const createFilesWorkerUrl = (
  config: NonNullable<ReturnType<typeof getFilesWorkerConfig>>,
  asset: PurchasedAsset,
  bucket: SignedFileBucket,
  now = Date.now(),
) =>
  createSignedFileUrl(config.baseUrl, config.secret, {
    bucket,
    objectKey: asset.objectKey,
    fileName: asset.fileName,
    ...(asset.contentType ? { contentType: asset.contentType } : {}),
    expiresAtSeconds: Math.floor(now / 1000) + SIGNED_FILE_LINK_TTL_SECONDS,
  });
