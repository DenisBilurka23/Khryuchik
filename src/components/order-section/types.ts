import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";
import type { CountryCode } from "@/utils";

export type OrderSectionProps = {
  locale: Locale;
  country: CountryCode;
  dictionary: StorefrontDictionary;
  shopHref: string;
  cartHref: string;
};
