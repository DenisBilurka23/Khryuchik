import { BOOK_SERIES_VALUES } from "@/constants/catalog";
import type { BookSeries, LocalizedCategory } from "@/types/catalog";

import type {
  CreateShopPageViewModelParams,
  ShopFilterValue,
} from "@/components/shop-page-view/types";

export const isShopFilterValue = (
  value: string | null,
  categories: LocalizedCategory[],
): value is ShopFilterValue =>
  value === "all" || categories.some((category) => category.key === value);

export const isBookSeries = (value: string | null): value is BookSeries =>
  BOOK_SERIES_VALUES.some((series) => series === value);

export const createShopPageViewModel = ({
  locale,
  country,
  allFilterLabel,
  categories,
  products,
  selectedFilter,
  selectedSeries,
  seriesLabels,
  search,
}: CreateShopPageViewModelParams) => {
  void country;

  const filters = [
    {
      value: "all",
      label: allFilterLabel,
    },
    ...categories.map((category) => ({
      value: category.key,
      label: category.label,
    })),
  ];

  const seriesFilters = [
    {
      value: "all",
      label: allFilterLabel,
    },
    ...BOOK_SERIES_VALUES.map((series) => ({
      value: series,
      label: seriesLabels[series],
    })),
  ];

  const normalizedSearch = search.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedFilter === "all" || product.category === selectedFilter;
    const matchesSeries =
      selectedSeries === "all" || product.series === selectedSeries;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      product.searchIndex.includes(normalizedSearch);

    return matchesCategory && matchesSeries && matchesSearch;
  });

  return {
    homeHref: locale === "en" ? "/" : `/${locale}/`,
    shopHref: locale === "en" ? "/shop" : `/${locale}/shop`,
    filters,
    seriesFilters,
    filteredProducts,
  };
};