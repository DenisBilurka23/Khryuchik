import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";
import type { CountryCode } from "@/utils";
import type { LocalizedCategory, LocalizedProductSummary } from "@/types/catalog";

export type ShopFilterValue = "all" | string;

export type ShopPageViewProps = {
  locale: Locale;
  country: CountryCode;
  dictionary: StorefrontDictionary;
  categories: LocalizedCategory[];
  products: LocalizedProductSummary[];
  initialCategory?: string;
  initialQuery?: string;
};

export type CreateShopPageViewModelParams = {
  locale: Locale;
  country: CountryCode;
  dictionary: StorefrontDictionary;
  categories: LocalizedCategory[];
  products: LocalizedProductSummary[];
  selectedFilter: ShopFilterValue;
  search: string;
};