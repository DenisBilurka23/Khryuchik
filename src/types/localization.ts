import type { CurrencyCode } from "@/utils";

export type LocaleDocument = {
  code: string;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
};

export type RegionDocument = {
  code: string;
  currency: CurrencyCode;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
};

export type RegionPricingConversion = {
  currency: CurrencyCode;
  rate: number;
  sourceCountry: string;
};

export type RegionPricing =
  | { status: "native" }
  | { status: "converted"; conversion: RegionPricingConversion }
  | { status: "unavailable"; currency: CurrencyCode };
