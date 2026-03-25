import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";
import type { LocalizedProductSummary } from "@/types/catalog";

export type BooksSectionProps = {
  locale: Locale;
  dictionary: StorefrontDictionary;
  books: LocalizedProductSummary[];
};
