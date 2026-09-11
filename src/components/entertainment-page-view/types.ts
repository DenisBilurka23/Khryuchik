import type { Locale } from "@/i18n/config";
import type {
  EntertainmentCategoryKey,
  LocalizedEntertainmentItem,
} from "@/types/entertainment";

export type EntertainmentPageViewProps = {
  locale: Locale;
  items: LocalizedEntertainmentItem[];
  selectedCategory: EntertainmentCategoryKey;
};
