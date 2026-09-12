import type { Locale } from "@/i18n/config";
import type { AdminEntertainmentAudioTrackRow } from "@/hooks/useAdminEntertainmentAudioTracks.types";
import type { AdminEntertainmentUploadedFile } from "@/types/admin";

import type { AdminEntertainmentPendingChangeHandler } from "../../../types";

export type AdminEntertainmentAudioTrackRowProps = {
  row: AdminEntertainmentAudioTrackRow;
  locale: Locale;
  slug?: string;
  onLanguageChangeAction: (key: string, language: string) => void;
  onUploadedAction: (
    key: string,
    uploadedFile: AdminEntertainmentUploadedFile,
  ) => void;
  onRemoveAction: (key: string) => void;
  onPendingChangeAction: AdminEntertainmentPendingChangeHandler;
};
