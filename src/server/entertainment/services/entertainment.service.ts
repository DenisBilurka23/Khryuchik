import "server-only";

import { cache } from "react";

import { HOME_ENTERTAINMENT_LIMIT } from "@/constants/entertainment";
import type { Locale } from "@/i18n/config";
import type {
  EntertainmentCategoryKey,
  EntertainmentItemDocument,
} from "@/types/entertainment";
import {
  isLocalizedEntertainmentItem,
  localizeEntertainmentItem,
} from "@/utils";

import {
  findEntertainmentItemBySlug,
  findHomeEntertainmentItems,
  findPublishedEntertainmentItems,
} from "../repositories/entertainment.repository";

const localizeEntertainmentItems = (
  items: EntertainmentItemDocument[],
  locale: Locale,
) =>
  items
    .map((item) => localizeEntertainmentItem(item, locale))
    .filter(isLocalizedEntertainmentItem);

export const getHomeEntertainmentItems = cache(
  async (locale: Locale, category?: EntertainmentCategoryKey) =>
    localizeEntertainmentItems(
      await findHomeEntertainmentItems(HOME_ENTERTAINMENT_LIMIT, category),
      locale,
    ),
);

export const getEntertainmentItems = cache(
  async (locale: Locale, category?: EntertainmentCategoryKey) =>
    localizeEntertainmentItems(
      await findPublishedEntertainmentItems(category),
      locale,
    ),
);

export const getEntertainmentItem = cache(
  async (locale: Locale, slug: string) => {
    const item = await findEntertainmentItemBySlug(slug);

    return item ? localizeEntertainmentItem(item, locale) : null;
  },
);
