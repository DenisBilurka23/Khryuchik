import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { getLocalizedPath } from "@/utils";

import type { StorefrontHeaderViewModel } from "./types";

export const createStorefrontHeaderViewModel = (
  locale: Locale,
  availableLocales: string[] = [],
): StorefrontHeaderViewModel => {
  return {
    availableLocales,
    localizedPaths: Object.fromEntries(
      availableLocales.map((targetLocale) => [
        targetLocale,
        targetLocale === defaultLocale ? "/" : `/${targetLocale}`,
      ]),
    ) as Record<Locale, string>,
    navigationPaths: {
      shop: getLocalizedPath(locale, "/shop"),
      story: getLocalizedPath(locale, "/story"),
      faq: getLocalizedPath(locale, "/delivery"),
      contacts: getLocalizedPath(locale, "/contacts"),
      favorites: getLocalizedPath(locale, "/favorites"),
      cart: getLocalizedPath(locale, "/cart"),
    },
  };
};

export type { StorefrontHeaderViewModel, StorefrontNavigationPaths } from "./types";