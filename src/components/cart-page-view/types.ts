import type { Locale } from "@/i18n/config";
import type { CountryCode, CurrencyCode } from "@/utils";

export type CartPageViewProps = {
  locale: Locale;
  country: CountryCode;
  currency: CurrencyCode;
  isShopClosed?: boolean;
};