import "server-only";

import { cache } from "react";

import {
  ENTERTAINMENT_CATEGORIES,
  HOME_ENTERTAINMENT_LIMIT,
} from "@/constants/entertainment";
import type { Locale } from "@/i18n/config";
import type {
  EntertainmentCategoryKey,
  EntertainmentCategoryView,
  EntertainmentItemDocument,
  LocalizedEntertainmentItem,
} from "@/types/entertainment";
import {
  isLocalizedEntertainmentItem,
  localizeEntertainmentItem,
} from "@/utils";

import {
  findEntertainmentItemBySlug,
  findHomeEntertainmentItems,
  findPublishedEntertainmentItems,
  incrementEntertainmentItemViews,
} from "../repositories/entertainment.repository";

const localizeEntertainmentItems = (
  items: EntertainmentItemDocument[],
  locale: Locale,
) =>
  items
    .map((item) => localizeEntertainmentItem(item, locale))
    .filter(isLocalizedEntertainmentItem);

const buildEntertainmentCategoryView = (
  items: LocalizedEntertainmentItem[],
  requestedCategory: EntertainmentCategoryKey,
  limit?: number,
): EntertainmentCategoryView => {
  const availableCategories = ENTERTAINMENT_CATEGORIES.filter((category) =>
    items.some((item) => item.category === category),
  );
  const selectedCategory = availableCategories.includes(requestedCategory)
    ? requestedCategory
    : (availableCategories[0] ?? null);
  const selectedItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : [];

  return {
    availableCategories,
    selectedCategory,
    items: limit ? selectedItems.slice(0, limit) : selectedItems,
  };
};

export const getHomeEntertainmentView = cache(
  async (locale: Locale, requestedCategory: EntertainmentCategoryKey) =>
    buildEntertainmentCategoryView(
      localizeEntertainmentItems(await findHomeEntertainmentItems(), locale),
      requestedCategory,
      HOME_ENTERTAINMENT_LIMIT,
    ),
);

export const getEntertainmentView = cache(
  async (locale: Locale, requestedCategory: EntertainmentCategoryKey) =>
    buildEntertainmentCategoryView(
      localizeEntertainmentItems(
        await findPublishedEntertainmentItems(),
        locale,
      ),
      requestedCategory,
    ),
);

export const getEntertainmentItem = cache(
  async (locale: Locale, slug: string) => {
    const item = await findEntertainmentItemBySlug(slug);

    return item ? localizeEntertainmentItem(item, locale) : null;
  },
);

export const registerEntertainmentItemView = async (slug: string) => {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    return false;
  }

  return incrementEntertainmentItemViews(normalizedSlug);
};
