import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";

export type ShopSectionProps = {
  locale: Locale;
  selectedFilter: string;
  visibleProducts: StorefrontDictionary["shopSection"]["items"];
  dictionary: StorefrontDictionary;
  setSelectedFilter: (filterLabel: string) => void;
  addToCart: (productId: string) => void;
};
