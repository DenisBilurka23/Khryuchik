import { defaultLocale, type Locale } from "@/i18n/config";

export const getLocalizedPath = (locale: Locale, path: string) => {
  if (locale === defaultLocale) {
    return path;
  }

  return path === "/" ? `/${locale}` : `/${locale}${path}`;
};

export const getLocalizedProductPath = (locale: Locale, slug: string) =>
  getLocalizedPath(locale, `/products/${slug}`);

export const getLocalizedEntertainmentPath = (locale: Locale, slug: string) =>
  getLocalizedPath(locale, `/entertainment/${slug}`);
