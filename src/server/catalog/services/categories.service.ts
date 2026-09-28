import "server-only";

import { cache } from "react";

import type { Locale } from "@/i18n/config";
import type { LocalizedCategory } from "@/types/catalog";
import {
  type RegionCode,
  isLocalizedCategory,
  localizeCategory,
} from "@/utils";
import {
  findHomeTabCategories,
  findShopVisibleCategories,
} from "../repositories/categories.repository";
import { findCategoryKeysWithProducts } from "../repositories/products.repository";

const keepCategoriesSoldIn = async (
  categories: LocalizedCategory[],
  region: RegionCode,
) => {
  const categoryKeys = new Set(await findCategoryKeysWithProducts(region));

  return categories.filter((category) => categoryKeys.has(category.key));
};

export const getShopCategories = cache(async (locale: Locale) => {
  const categories = await findShopVisibleCategories();

  return categories
    .map((category) => localizeCategory(category, locale))
    .filter(isLocalizedCategory);
});

export const getShopCategoriesForRegion = cache(
  async (locale: Locale, region: RegionCode) =>
    keepCategoriesSoldIn(await getShopCategories(locale), region),
);

export const getHomeTabCategories = cache(
  async (locale: Locale, region: RegionCode) => {
    const categories = await findHomeTabCategories();
    const localizedCategories = categories
      .map((category) => localizeCategory(category, locale))
      .filter(isLocalizedCategory);

    return keepCategoriesSoldIn(localizedCategories, region);
  },
);
