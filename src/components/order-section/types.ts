import type { Locale } from "@/i18n/config";
import type { CountryCode, CurrencyCode } from "@/utils";

export type OrderSectionProps = {
  locale: Locale;
  country: CountryCode;
  currency: CurrencyCode;
  shopHref: string;
  cartHref: string;
};
