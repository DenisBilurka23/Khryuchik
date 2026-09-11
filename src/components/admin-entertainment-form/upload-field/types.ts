import type { AdminEntertainmentUploadKind } from "@/client-api/admin";
import type { Locale } from "@/i18n/config";
import type { AdminEntertainmentUploadedFile } from "@/types/admin";

import type { AdminEntertainmentPendingChangeHandler } from "../types";

export type AdminEntertainmentUploadFieldProps = {
  pendingKey: string;
  kind: AdminEntertainmentUploadKind;
  accept: string;
  contentTypes: string[];
  maxBytes: number;
  dropLabel: string;
  dropHint: string;
  slug?: string;
  locale?: Locale;
  currentLabel?: string;
  currentMeta?: string;
  previewUrl?: string;
  onUploadedAction: (
    uploadedFile: AdminEntertainmentUploadedFile,
    sourceFile: File,
  ) => void;
  onRemoveAction?: () => void;
  onPendingChangeAction: AdminEntertainmentPendingChangeHandler;
};
