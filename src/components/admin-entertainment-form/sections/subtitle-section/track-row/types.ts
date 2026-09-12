import type { Locale } from "@/i18n/config";
import type { AdminEntertainmentSubtitleTrackRow } from "@/hooks/useAdminEntertainmentSubtitleTracks.types";
import type { AdminEntertainmentUploadedFile } from "@/types/admin";

import type { AdminEntertainmentPendingChangeHandler } from "../../../types";

export type AdminEntertainmentSubtitleTrackRowProps = {
  row: AdminEntertainmentSubtitleTrackRow;
  locale: Locale;
  slug?: string;
  takenLanguages: string[];
  onLanguageChangeAction: (key: string, language: string) => void;
  onPublishedChangeAction: (key: string, isPublished: boolean) => void;
  onUploadedAction: (
    key: string,
    uploadedFile: AdminEntertainmentUploadedFile,
  ) => void;
  onRemoveAction: (key: string) => void;
  onPendingChangeAction: AdminEntertainmentPendingChangeHandler;
};
