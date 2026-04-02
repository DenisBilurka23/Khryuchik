import type { Locale } from "@/i18n/config";
import { defaultLocale, locales } from "@/i18n/config";

import { getLocalizedPath } from "../utils";

export const createStorefrontHeaderViewModel = (locale: Locale) => {
  const homeHref = getLocalizedPath(locale, "/");

  return {
    localizedPaths: Object.fromEntries(
      locales.map((targetLocale) => [
        targetLocale,
        targetLocale === defaultLocale ? "/" : `/${targetLocale}`,
      ]),
    ) as Record<Locale, string>,
    navigationPaths: {
      books: getLocalizedPath(locale, "/shop?category=books"),
      shop: getLocalizedPath(locale, "/shop"),
      story: `${homeHref}#story`,
      faq: `${homeHref}#faq`,
      cart: getLocalizedPath(locale, "/cart"),
    },
  };
};