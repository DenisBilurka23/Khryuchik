import type { Locale } from "@/i18n/config";
import type { CountLabelForms } from "@/i18n/types";

export {
  COUNTRY_COOKIE_NAME,
  COUNTRY_HEADER,
  countries,
  countryShippingConfig,
  defaultCountry,
  geoCountryHeaderNames,
  getCountryDisplayName,
  getCountryFromCookieHeader,
  getCountryFromGeoCode,
  getCountryFromGeoHeaders,
  getCountryPaymentMethods,
  getRegionShipping,
  getAllCountriesSorted,
  isCountryCode,
  isIsoCountryCode,
  isPaymentMethodAvailable,
  readCountryCookie,
} from "./country";

export type { CountryCode, CurrencyCode, PaymentMethod } from "./country";

export const getLocaleShortLabel = (locale: Locale) =>
  locale.toUpperCase();

export const getLocaleDisplayName = (
  locale: Locale,
  displayLocale: Locale,
) => {
  const displayName = new Intl.DisplayNames([displayLocale], {
    type: "language",
  }).of(locale);

  return displayName
    ? displayName.charAt(0).toUpperCase() + displayName.slice(1)
    : getLocaleShortLabel(locale);
};

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

export { formatCurrency, getAllCurrenciesSorted } from "./format-currency";
export type { CurrencyOption } from "./format-currency";
export { formatFileSize } from "./format-file-size";
export { formatOrderNumber } from "./format-order-number";

export const getLocalizedPath = (locale: Locale, path: string) =>
  locale === "en" ? path : `/${locale}${path}`;

export { isLocalizedCategory, localizeCategory } from "./category";
export { getCustomerOrderStatus, isOrderStatus, toAccountOrder } from "./order";
export {
  isLocalizedProductSummary,
  localizeProductSummary,
  toProductDetails,
} from "./product";

export const getLocalizedProductPath = (locale: Locale, slug: string) =>
  getLocalizedPath(locale, `/products/${slug}`);