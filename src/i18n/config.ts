// Built-in UI locales that ship with translated dictionaries. Admin-managed
// product languages may extend beyond this set; locales without a shipped
// dictionary fall back to English at the UI layer.
export const locales = ["ru", "en"] as const;

export const defaultLocale = "en";

export const LOCALE_HEADER = "x-khryuchik-locale";

export const ADMIN_LOCALE_COOKIE_NAME = "khryuchik-admin-locale";

export const ADMIN_LOCALE_QUERY_PARAM = "adminLocale";

// Locale codes are open-ended strings so admin-managed languages are not
// constrained to the built-in set. `isLocale` still narrows against the
// shipped UI locales for routing and dictionary resolution.
export type Locale = string;

export type BuiltInLocale = (typeof locales)[number];

export const isLocale = (value: string): value is BuiltInLocale =>
  locales.some((locale) => locale === value);
