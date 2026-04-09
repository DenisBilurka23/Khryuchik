import type { Locale } from "@/i18n/config";
import type { CountLabelForms } from "@/i18n/types";
import type { CurrencyCode } from "./country";

export {
  COUNTRY_COOKIE_NAME,
  COUNTRY_HEADER,
  countries,
  countryCurrencies,
  countryLabels,
  countryShippingConfig,
  defaultCountry,
  geoCountryHeaderNames,
  getCountryCurrency,
  getCountryFromCookieHeader,
  getCountryFromGeoCode,
  getCountryFromGeoHeaders,
  isCountryCode,
} from "./country";

export type { CountryCode, CurrencyCode } from "./country";

export const localeLabels: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
};

export const promoBackgrounds = ["#FFF0C9", "#DDF3E8"];

export const getCountLabel = (
  count: number,
  locale: Locale,
  labels?: CountLabelForms,
) => {
  const pluralRules = new Intl.PluralRules(locale === "ru" ? "ru-RU" : "en-US");
  const category = pluralRules.select(count);

  if (!labels) {
    return String(count);
  }

  const fallbackLabel = labels.other ?? labels.one;

  if (category === "one") {
    return `${count} ${labels.one ?? fallbackLabel}`;
  }

  if (category === "few") {
    return `${count} ${labels.few ?? fallbackLabel}`;
  }

  if (category === "many") {
    return `${count} ${labels.many ?? fallbackLabel}`;
  }

  return `${count} ${fallbackLabel}`;
};

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