import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";
import type { CountryCode } from "@/lib/countries";

export type CartPageViewProps = {
  locale: Locale;
  country: CountryCode;
  dictionary: StorefrontDictionary;
};