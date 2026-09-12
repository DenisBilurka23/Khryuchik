import type { Locale } from "@/i18n/config";
import type { EntertainmentCategoryView } from "@/types/entertainment";

export type EntertainmentPageViewProps = {
  locale: Locale;
  entertainment: EntertainmentCategoryView;
};
