import type { Locale } from "@/i18n/config";
import type {
  LocalizedCategory,
  LocalizedProductSummary,
} from "@/types/catalog";
import type {
  EntertainmentCategoryKey,
  LocalizedEntertainmentItem,
} from "@/types/entertainment";
import type { HomeShopFilterValue } from "../shop-section/types";

export type StorefrontProps = {
  locale: Locale;
  shopCategories: LocalizedCategory[];
  books: LocalizedProductSummary[];
  shopProducts: LocalizedProductSummary[];
  selectedShopCategory: HomeShopFilterValue;
  entertainmentItems: LocalizedEntertainmentItem[];
  selectedEntertainmentCategory: EntertainmentCategoryKey;
};
