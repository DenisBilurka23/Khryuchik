import "server-only";

import { cache } from "react";

import type { Locale } from "@/i18n/config";
import type { LocalizedCategory } from "@/types/catalog";
import {
  type CountryCode,
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
  country: CountryCode,
) => {
  const categoryKeys = new Set(await findCategoryKeysWithProducts(country));

  return categories.filter((category) => categoryKeys.has(category.key));
};

export const getShopCategories = cache(async (locale: Locale) => {
  const categories = await findShopVisibleCategories();

  return categories
    .map((category) => localizeCategory(category, locale))
    .filter(isLocalizedCategory);
});

export const getShopCategoriesForRegion = cache(
  async (locale: Locale, country: CountryCode) =>
    keepCategoriesSoldIn(await getShopCategories(locale), country),
);

export const getHomeTabCategories = cache(
  async (locale: Locale, country: CountryCode) => {
    const categories = await findHomeTabCategories();
    const localizedCategories = categories
      .map((category) => localizeCategory(category, locale))
      .filter(isLocalizedCategory);

    return keepCategoriesSoldIn(localizedCategories, country);
  },
);
