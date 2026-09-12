import type { Locale } from "@/i18n/config";
import type { EntertainmentCategoryView } from "@/types/entertainment";

export type EntertainmentSectionProps = {
  locale: Locale;
  entertainment: EntertainmentCategoryView;
};
