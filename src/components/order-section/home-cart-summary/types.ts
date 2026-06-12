import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/utils";

export type HomeCartSummaryProps = {
  locale: Locale;
  country: CountryCode;
  shopHref: string;
  cartHref: string;
};