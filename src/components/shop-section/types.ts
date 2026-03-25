import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";
import type { LocalizedCategory, LocalizedProductSummary } from "@/types/catalog";

export type HomeShopFilterValue = "all" | string;

export type ShopSectionProps = {
  locale: Locale;
  categories: LocalizedCategory[];
  products: LocalizedProductSummary[];
  dictionary: StorefrontDictionary;
  selectedFilter: HomeShopFilterValue;
};
