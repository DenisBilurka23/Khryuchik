import type { Locale } from "@/i18n/config";

export const getLocaleShortLabel = (locale: Locale) => locale.toUpperCase();

export const getLocaleDisplayName = (locale: Locale, displayLocale: Locale) => {
  const displayName = new Intl.DisplayNames([displayLocale], {
    type: "language",
  }).of(locale);

  return displayName
    ? displayName.charAt(0).toUpperCase() + displayName.slice(1)
    : getLocaleShortLabel(locale);
};
