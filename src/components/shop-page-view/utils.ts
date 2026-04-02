import type { LocalizedCategory } from "@/types/catalog";

import type { CreateShopPageViewModelParams, ShopFilterValue } from "./types";

export const isShopFilterValue = (
  value: string | null,
  categories: LocalizedCategory[],
): value is ShopFilterValue =>
  value === "all" || categories.some((category) => category.key === value);

export const createShopPageViewModel = ({
  locale,
  country,
  dictionary,
  categories,
  products,
  selectedFilter,
  search,
}: CreateShopPageViewModelParams) => {
  void country;

  const filters = [
    {
      value: "all",
      label: dictionary.shopPage.filters.all,
    },
    ...categories.map((category) => ({
      value: category.key,
      label: category.label,
    })),
  ];

  const normalizedSearch = search.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedFilter === "all" || product.category === selectedFilter;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      product.searchIndex.includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  return {
    homeHref: locale === "en" ? "/" : `/${locale}/`,
    shopHref: locale === "en" ? "/shop" : `/${locale}/shop`,
    filters,
    filteredProducts,
  };
};