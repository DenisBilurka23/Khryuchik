import type { Locale } from "@/i18n/config";
import type { EntertainmentAudioTrack } from "@/types/entertainment";

import type { AdminEntertainmentPendingChangeHandler } from "../../types";

export type AdminEntertainmentAudioSectionProps = {
  locale: Locale;
  slug?: string;
  storedTracks: EntertainmentAudioTrack[];
  onPendingChangeAction: AdminEntertainmentPendingChangeHandler;
};
