import type { RefObject } from "react";

import type { Locale } from "@/i18n/config";

export type UsePreferredAudioTrackOptions = {
  videoRef: RefObject<HTMLElement | null>;
  locale: Locale;
};
