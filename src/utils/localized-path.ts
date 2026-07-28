import type { Locale } from "@/i18n/config";

export const getLocalizedPath = (locale: Locale, path: string) =>
  locale === "en" ? path : `/${locale}${path}`;

export const getLocalizedProductPath = (locale: Locale, slug: string) =>
  getLocalizedPath(locale, `/products/${slug}`);
