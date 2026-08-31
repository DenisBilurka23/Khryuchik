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
};

export type RegionPricing =
  | { status: "native"; currency: CurrencyCode }
  | {
      status: "converted";
      currency: CurrencyCode;
      conversion: RegionPricingConversion;
    }
  | { status: "unavailable"; currency: CurrencyCode };
