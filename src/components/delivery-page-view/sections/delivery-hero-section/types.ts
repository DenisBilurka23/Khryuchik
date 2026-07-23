import type { Locale } from "@/i18n/config";
import type { DeliveryPageLabels } from "@/i18n/types";
import type { CountryCode } from "@/utils";

export type DeliveryHeroSectionProps = DeliveryPageLabels["hero"] & {
  locale: Locale;
  country: CountryCode;
  accent: string;
  heroGradient: string;
};
