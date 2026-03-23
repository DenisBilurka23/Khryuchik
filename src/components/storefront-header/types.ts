import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";

export type StorefrontHeaderProps = {
  locale: Locale;
  totalCount: number;
  dictionary: StorefrontDictionary;
  buildLocalizedPath: (targetLocale: Locale) => string;
};
