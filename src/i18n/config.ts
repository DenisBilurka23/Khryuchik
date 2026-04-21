export const locales = ["ru", "en"] as const;

export const defaultLocale = "en";

export const ADMIN_LOCALE_COOKIE_NAME = "khryuchik-admin-locale";

export const ADMIN_LOCALE_QUERY_PARAM = "adminLocale";

export type Locale = (typeof locales)[number];

export const isLocale = (value: string): value is Locale =>
  locales.some((locale) => locale === value);
