import type { Locale } from "@/i18n/config";
import type { LocalizedProductSummary } from "@/types/catalog";

export type BooksSectionProps = {
  locale: Locale;
  books: LocalizedProductSummary[];
};
