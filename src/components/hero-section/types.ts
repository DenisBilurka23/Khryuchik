import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";
import type { CountryCode } from "@/shared/countries";

export type HeroSectionProps = {
  locale: Locale;
  country: CountryCode;
  dictionary: StorefrontDictionary;
};
