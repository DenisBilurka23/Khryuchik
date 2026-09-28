import type { RegionCode } from "@/types/localization";
import type { CurrencyCode } from "@/utils";

export const REGION_CODES: readonly RegionCode[] = ["northAmerica", "europe"];

export const REGION_DEFAULT_CURRENCY: Record<RegionCode, CurrencyCode> = {
  northAmerica: "USD",
  europe: "EUR",
};

export const DEFAULT_REGION: RegionCode = "northAmerica";

export const REGION_COOKIE_NAME = "khryuchik-region";

export const REGION_CHANGE_EVENT = "khryuchik-region-change";
