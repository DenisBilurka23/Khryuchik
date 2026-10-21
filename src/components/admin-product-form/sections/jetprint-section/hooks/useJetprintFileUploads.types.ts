import type { RefObject } from "react";

import type { Locale } from "@/i18n/config";
import type { JetprintFile } from "@/types/catalog";

export type JetprintFileUploadStatus =
  | "pending"
  | "uploading"
  | "uploaded"
  | "error";

export type JetprintFileUploadItem = {
  id: string;
  file: File;
  status: JetprintFileUploadStatus;
  progress: number;
  uploaded?: JetprintFile;
};

export type UseJetprintFileUploadsOptions = {
  locale: Locale;
  productId?: string;
  existingFiles: JetprintFile[];
};

export type UseJetprintFileUploadsResult = {
  stored: JetprintFile[];
  pending: JetprintFileUploadItem[];
  hiddenInputRef: RefObject<HTMLInputElement | null>;
  value: string;
  addFiles: (files: File[]) => void;
  replaceFiles: (files: File[]) => void;
  removeStored: (url: string) => void;
  removePending: (id: string) => void;
};
