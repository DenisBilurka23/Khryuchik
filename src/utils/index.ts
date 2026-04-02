import type { Locale } from "@/i18n/config";

export type CountryCode = "BY" | "US";

export type CurrencyCode = "BYN" | "USD";

export const geoCountryHeaderNames = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "cloudfront-viewer-country",
  "x-country-code",
  "x-country",
  "x-geo-country",
] as const;

export const countries = ["BY", "US"] as const;

export const defaultCountry: CountryCode = "US";

export const COUNTRY_COOKIE_NAME = "khryuchik-country";

export const COUNTRY_HEADER = "x-khryuchik-country";

export const isCountryCode = (value: string | null | undefined): value is CountryCode =>
  Boolean(value && countries.includes(value as CountryCode));

export const countryLabels: Record<Locale, Record<CountryCode, string>> = {
  ru: {
    BY: "BY",
    US: "US",
  },
  en: {
    BY: "BY",
    US: "US",
  },
};

export const countryCurrencies: Record<CountryCode, CurrencyCode> = {
  BY: "BYN",
  US: "USD",
};

export const countryShippingConfig: Record<
  CountryCode,
  {
    freeShippingThreshold: number;
    shippingPrice: number;
  }
> = {
  BY: {
    freeShippingThreshold: 80,
    shippingPrice: 8,
  },
  US: {
    freeShippingThreshold: 35,
    shippingPrice: 6,
  },
};

export const getCountryCurrency = (country: CountryCode) =>
  countryCurrencies[country];

export const getCountryFromGeoCode = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  return value.trim().toUpperCase() === "BY" ? "BY" : "US";
};

export const getCountryFromGeoHeaders = (headers: Headers) => {
  const headerValue = geoCountryHeaderNames
    .map((headerName) => headers.get(headerName))
    .find(Boolean);

  return getCountryFromGeoCode(headerValue);
};

export const getCountryFromCookieHeader = (cookieHeader: string | null) => {
  if (!cookieHeader) {
    return null;
  }

  const countryCookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COUNTRY_COOKIE_NAME}=`))
    ?.split("=")[1];

  return isCountryCode(countryCookie) ? countryCookie : null;
};

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