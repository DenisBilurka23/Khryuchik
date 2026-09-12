import type { Locale } from "@/i18n/config";
import type { EntertainmentTranslation } from "@/types/entertainment";

import type { AdminEntertainmentPendingChangeHandler } from "../../types";

export type AdminEntertainmentLocaleSectionProps = {
  locale: Locale;
  label: string;
  isDefaultLocale: boolean;
  isActive: boolean;
  canToggle: boolean;
  onToggleActiveAction: (locale: Locale, isActive: boolean) => void;
  slug?: string;
  videoFile?: File | null;
  translation?: EntertainmentTranslation;
  onPendingChangeAction: AdminEntertainmentPendingChangeHandler;
};
