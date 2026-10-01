import type { Locale } from "@/i18n/config";
import type { CurrencyCode, RegionCode } from "@/utils";

export type CartPageSkeletonProps = {
  locale: Locale;
};

export type CartPageViewProps = {
  locale: Locale;
  region: RegionCode;
  currency: CurrencyCode;
  isShopClosed?: boolean;
};
