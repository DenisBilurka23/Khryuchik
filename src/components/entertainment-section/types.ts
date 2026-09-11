import type { Locale } from "@/i18n/config";
import type {
  EntertainmentCategoryKey,
  LocalizedEntertainmentItem,
} from "@/types/entertainment";

export type EntertainmentSectionProps = {
  locale: Locale;
  items: LocalizedEntertainmentItem[];
  selectedCategory: EntertainmentCategoryKey;
};
