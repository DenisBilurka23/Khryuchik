import type { ObjectId } from "mongodb";

export type OrderDownloadTokenDocument = {
  _id?: ObjectId;
  orderId: string;
  tokenHash: string;
  createdAt: Date;
  expiresAt: Date;
};

export type OrderDownload = {
  productTitle: string;
  assetId: string;
  label: string;
  format: string;
  sizeBytes?: number;
  downloadUrl: string;
};

export type OrderDownloadBundle = {
  orderId: string;
  locale: string;
  downloads: OrderDownload[];
};

export type AccountDownload = {
  productId: string;
  productTitle: string;
  assetId: string;
  label: string;
  format: string;
  locale: string;
  sizeBytes?: number;
  downloadUrl: string;
};

export type ProductPurchaseContext = {
  ownedLanguages: string[];
  hasDeliveredPurchase: boolean;
};

export type SignedFileBucket = "public" | "private";

export type SignedFile = {
  bucket: SignedFileBucket;
  objectKey: string;
  fileName: string;
  contentType?: string;
  expiresAtSeconds: number;
};

export type SignedFileCheck =
  | { ok: true; file: SignedFile }
  | { ok: false; reason: "invalid" | "expired" };
