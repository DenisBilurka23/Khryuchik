import type { Locale } from "@/i18n/config";
import type {
  LocalizedCategory,
  LocalizedProductSummary,
} from "@/types/catalog";
import type { EntertainmentCategoryView } from "@/types/entertainment";
import type { HomeShopFilterValue } from "@/components/shop-section/types";

export type HomePageViewProps = {
  locale: Locale;
  shopCategories: LocalizedCategory[];
  books: LocalizedProductSummary[];
  shopProducts: LocalizedProductSummary[];
  selectedShopCategory: HomeShopFilterValue;
  entertainment: EntertainmentCategoryView;
};
