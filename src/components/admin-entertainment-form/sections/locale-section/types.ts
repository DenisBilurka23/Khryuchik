import type { Locale } from "@/i18n/config";
import type { EntertainmentTranslation } from "@/types/entertainment";

import type { AdminEntertainmentPendingChangeHandler } from "../../types";

export type AdminEntertainmentLocaleSectionProps = {
  locale: Locale;
  label: string;
  isDefaultLocale: boolean;
  slug?: string;
  videoFile?: File | null;
  translation?: EntertainmentTranslation;
  onPendingChangeAction: AdminEntertainmentPendingChangeHandler;
};
