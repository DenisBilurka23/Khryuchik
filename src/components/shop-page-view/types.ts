import type { Locale } from "@/i18n/config";
import type { ReactNode } from "react";
import type { RegionCode } from "@/utils";
import type {
  BookSeries,
  LocalizedCategory,
  LocalizedProductSummary,
} from "@/types/catalog";

export type ShopFilterValue = "all" | string;

export type ShopSeriesFilterValue = "all" | BookSeries;

export type ShopPageViewProps = {
  locale: Locale;
  children: ReactNode;
};

export type ShopCatalogProps = {
  locale: Locale;
  region: RegionCode;
  categories: LocalizedCategory[];
  products: LocalizedProductSummary[];
  initialCategory?: string;
  initialSeries?: string;
  initialQuery?: string;
};

export type CreateShopPageViewModelParams = {
  locale: Locale;
  region: RegionCode;
  allFilterLabel: string;
  categories: LocalizedCategory[];
  products: LocalizedProductSummary[];
  selectedFilter: ShopFilterValue;
  selectedSeries: ShopSeriesFilterValue;
  seriesLabels: Record<BookSeries, string>;
  search: string;
};
