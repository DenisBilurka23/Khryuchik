import type { Locale } from "@/i18n/config";
import type { AdminEntertainmentUploadedFile } from "@/types/admin";

import type { AdminEntertainmentPendingChangeHandler } from "../types";

export type AdminEntertainmentPosterFramePickerProps = {
  videoFile: File;
  locale: Locale;
  slug?: string;
  onUploadedAction: (uploadedFile: AdminEntertainmentUploadedFile) => void;
  onPendingChangeAction: AdminEntertainmentPendingChangeHandler;
};
