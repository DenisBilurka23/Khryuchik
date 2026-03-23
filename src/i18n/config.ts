export const locales = ["ru", "en"] as const;

export const defaultLocale = "en";

export type Locale = (typeof locales)[number];

export const isLocale = (value: string): value is Locale =>
  locales.some((locale) => locale === value);
