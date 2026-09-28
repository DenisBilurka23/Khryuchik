import type { Locale } from "@/i18n/config";
import type { RegionCode } from "@/utils";

export type NewRegionFieldsProps = {
  locale: Locale;
  regionCodes: RegionCode[];
};
