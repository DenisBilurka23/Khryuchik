import "server-only";

import { cache } from "react";

import type { Locale } from "@/i18n/config";

import {
  isLocalizedCategory,
  localizeCategory,
} from "../mappers/category.mapper";
import {
  findHomeTabCategories,
  findShopVisibleCategories,
} from "../repositories/categories.repository";

export const getShopCategories = cache(async (locale: Locale) => {
  const categories = await findShopVisibleCategories();

  return categories
    .map((category) => localizeCategory(category, locale))
    .filter(isLocalizedCategory);
});

export const getHomeTabCategories = cache(async (locale: Locale) => {
  const categories = await findHomeTabCategories();

  return categories
    .map((category) => localizeCategory(category, locale))
    .filter(isLocalizedCategory);
});