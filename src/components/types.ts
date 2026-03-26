import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";
import type { CountryCode } from "@/lib/countries";
import type { LocalizedCategory, LocalizedProductSummary } from "@/types/catalog";
import type { HomeShopFilterValue } from "./shop-section/types";

export type StorefrontProps = {
  locale: Locale;
  country: CountryCode;
  dictionary: StorefrontDictionary;
  shopCategories: LocalizedCategory[];
  books: LocalizedProductSummary[];
  shopProducts: LocalizedProductSummary[];
  selectedShopCategory: HomeShopFilterValue;
};
