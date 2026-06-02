import {
  COUNTRY_COOKIE_NAME,
  COUNTRY_HEADER,
  countries,
  defaultCountry,
  geoCountryHeaderNames,
} from "@/constants/country";
import type { Locale } from "@/i18n/config";

export type CountryCode = "BY" | "US";

export type CurrencyCode = "BYN" | "USD";

export type PaymentMethod = "stripe" | "cod" | "telegram_transfer";

export {
  COUNTRY_COOKIE_NAME,
  COUNTRY_HEADER,
  countries,
  defaultCountry,
  geoCountryHeaderNames,
};

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
  // Shipping pricing is not finalised yet — keep at 0 so totals stay clean
  // until the real rates are wired in.
  BY: {
    freeShippingThreshold: 80,
    shippingPrice: 0,
  },
  US: {
    freeShippingThreshold: 35,
    shippingPrice: 0,
  },
};

export const getCountryCurrency = (country: CountryCode) =>
  countryCurrencies[country];

// New countries default to Stripe; only regions where Stripe is unavailable
// (e.g. BY) opt into alternative methods explicitly.
const defaultPaymentMethods: PaymentMethod[] = ["stripe"];

const countryPaymentMethods: Partial<Record<CountryCode, PaymentMethod[]>> = {
  US: defaultPaymentMethods,
  BY: ["cod", "telegram_transfer"],
};

export const getCountryPaymentMethods = (
  country: CountryCode,
): PaymentMethod[] =>
  countryPaymentMethods[country] ?? defaultPaymentMethods;

export const isPaymentMethodAvailable = (
  country: CountryCode,
  method: PaymentMethod,
): boolean => getCountryPaymentMethods(country).includes(method);

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