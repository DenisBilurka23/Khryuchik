import type { Locale } from "@/i18n/config";
import type { DeliveryRegionOptionLabels } from "@/i18n/types";
import type { CountryCode } from "@/utils";

export type RegionToggleProps = {
  country: CountryCode;
  locale: Locale;
  accent: string;
  toggleAriaLabel: string;
  options: Record<CountryCode, DeliveryRegionOptionLabels>;
};
