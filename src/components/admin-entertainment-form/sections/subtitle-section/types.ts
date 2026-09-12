import type { Locale } from "@/i18n/config";
import type { EntertainmentSubtitleTrack } from "@/types/entertainment";

import type { AdminEntertainmentPendingChangeHandler } from "../../types";

export type AdminEntertainmentSubtitleSectionProps = {
  locale: Locale;
  slug?: string;
  storedTracks: EntertainmentSubtitleTrack[];
  onPendingChangeAction: AdminEntertainmentPendingChangeHandler;
};
