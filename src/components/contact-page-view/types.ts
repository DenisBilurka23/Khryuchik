import type { Locale } from "@/i18n/config";
import type { RegionCode } from "@/utils";

export type ContactPageSkeletonProps = {
  locale: Locale;
};

export type ContactPageViewProps = {
  locale: Locale;
  region: RegionCode;
};
