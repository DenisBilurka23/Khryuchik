import type { Locale } from "@/i18n/config";
import type { CurrencyCode } from "@/shared/countries";

export const localeLabels: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
};

export const promoBackgrounds = ["#FFF0C9", "#DDF3E8"];

export const formatCurrency = (
  value: number,
  locale: Locale,
  currency: CurrencyCode = "BYN",
) =>
  new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const getLocalizedPath = (locale: Locale, path: string) =>
  locale === "en" ? path : `/${locale}${path}`;

export const getLocalizedProductPath = (locale: Locale, slug: string) =>
  getLocalizedPath(locale, `/products/${slug}`);
