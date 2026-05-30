import type { Locale } from "@/i18n/config";
import { defaultLocale, locales } from "@/i18n/config";
import { getLocalizedPath } from "@/utils";

import type { StorefrontHeaderViewModel } from "./types";

export const createStorefrontHeaderViewModel = (
  locale: Locale,
): StorefrontHeaderViewModel => {
  return {
    localizedPaths: Object.fromEntries(
      locales.map((targetLocale) => [
        targetLocale,
        targetLocale === defaultLocale ? "/" : `/${targetLocale}`,
      ]),
    ) as Record<Locale, string>,
    navigationPaths: {
      shop: getLocalizedPath(locale, "/shop"),
      story: getLocalizedPath(locale, "/story"),
      faq: getLocalizedPath(locale, "/delivery"),
      favorites: getLocalizedPath(locale, "/favorites"),
      cart: getLocalizedPath(locale, "/cart"),
    },
  };
};

export type { StorefrontHeaderViewModel, StorefrontNavigationPaths } from "./types";