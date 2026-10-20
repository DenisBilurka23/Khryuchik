import "server-only";

import { cache } from "react";

import {
  DEFAULT_ENTERTAINMENT_FILTER,
  ENTERTAINMENT_CATEGORIES,
} from "@/constants/entertainment";
import type { Locale } from "@/i18n/config";
import type {
  EntertainmentCategoryView,
  EntertainmentFilterKey,
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
  findSitemapEntertainmentEntries,
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
  requestedCategory: EntertainmentFilterKey,
): EntertainmentCategoryView => {
  const availableCategories = ENTERTAINMENT_CATEGORIES.filter((category) =>
    items.some((item) => item.category === category),
  );
  const selectedCategory =
    requestedCategory === DEFAULT_ENTERTAINMENT_FILTER ||
    availableCategories.includes(requestedCategory)
      ? requestedCategory
      : DEFAULT_ENTERTAINMENT_FILTER;
  const selectedItems =
    selectedCategory === DEFAULT_ENTERTAINMENT_FILTER
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return {
    availableCategories,
    selectedCategory,
    items: selectedItems,
  };
};

export const getHomeEntertainmentView = cache(
  async (locale: Locale, requestedCategory: EntertainmentFilterKey) =>
    buildEntertainmentCategoryView(
      localizeEntertainmentItems(await findHomeEntertainmentItems(), locale),
      requestedCategory,
    ),
);

export const getEntertainmentView = cache(
  async (locale: Locale, requestedCategory: EntertainmentFilterKey) =>
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

export const getEntertainmentDownload = async (slug: string) => {
  const item = await findEntertainmentItemBySlug(slug);

  return item?.media.type === "download" ? item.media : null;
};

export const getSitemapEntertainmentEntries = cache(
  async (): Promise<{ slug: string; updatedAt: string }[]> =>
    (await findSitemapEntertainmentEntries()).map((item) => ({
      slug: item.slug,
      updatedAt: item.updatedAt,
    })),
);

export const registerEntertainmentItemView = async (slug: string) => {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    return false;
  }

  return incrementEntertainmentItemViews(normalizedSlug);
};
