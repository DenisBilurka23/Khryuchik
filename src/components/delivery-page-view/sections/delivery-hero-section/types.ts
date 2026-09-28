import type { DeliveryPageLabels } from "@/i18n/types";
import type { RegionCode } from "@/utils";

export type DeliveryHeroSectionProps = DeliveryPageLabels["hero"] & {
  region: RegionCode;
  regionLabel: string;
};
