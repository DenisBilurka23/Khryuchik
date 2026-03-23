import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";

export type StorefrontProps = {
  locale: Locale;
  dictionary: StorefrontDictionary;
};
