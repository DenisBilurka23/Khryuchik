import type { AdminEntertainmentUploadKind } from "@/client-api/admin";
import type { Locale } from "@/i18n/config";
import type { AdminEntertainmentUploadedFile } from "@/types/admin";

export type AdminEntertainmentUploadStatus =
  | "idle"
  | "uploading"
  | "uploaded"
  | "error";

export type AdminEntertainmentUploadErrorCode =
  | "invalidType"
  | "tooLarge"
  | "presignFailed"
  | "uploadFailed";

export type AdminEntertainmentUploadState = {
  status: AdminEntertainmentUploadStatus;
  progress: number;
  fileName?: string;
  errorCode?: AdminEntertainmentUploadErrorCode;
  file?: AdminEntertainmentUploadedFile;
};

export type UseAdminEntertainmentUploadOptions = {
  kind: AdminEntertainmentUploadKind;
  contentTypes: string[];
  maxBytes: number;
  slug?: string;
  locale?: Locale;
};

export type UseAdminEntertainmentUploadResult = {
  state: AdminEntertainmentUploadState;
  upload: (file: File) => Promise<AdminEntertainmentUploadedFile | null>;
  reset: () => void;
};
