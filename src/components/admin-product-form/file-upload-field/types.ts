import type { Locale } from "@/i18n/config";
import type { ProductFileAsset } from "@/types/product-details";

export type AdminFileUploadStatus =
  | "pending"
  | "uploading"
  | "uploaded"
  | "error";

export type AdminFileUploadStatusLabels = {
  pending: string;
  uploading: string;
  uploaded: string;
  error: string;
};

export type AdminFileUploadFieldProps = {
  assetsJsonInputName: string;
  locale: Locale;
  productId?: string;
  buttonLabel: string;
  helperText: string;
  existingFiles: ProductFileAsset[];
  statusLabels: AdminFileUploadStatusLabels;
};

export type AdminFileUploadItem = {
  id: string;
  file: File;
  status: AdminFileUploadStatus;
  progress: number;
  uploadedAsset?: ProductFileAsset;
  errorMessage?: string;
};
