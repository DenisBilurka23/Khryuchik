import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/utils";

export type OrderSectionProps = {
  locale: Locale;
  country: CountryCode;
  shopHref: string;
  cartHref: string;
};
