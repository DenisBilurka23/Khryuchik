import {
  countries,
  COUNTRY_COOKIE_NAME,
  COUNTRY_HEADER,
  defaultCountry,
  geoCountryHeaderNames,
} from "@/constants/country";
import { ALL_COUNTRY_CODES } from "@/constants/all-country-codes";

export type CountryCode = string;

export type BuiltInCountryCode = "BY" | "US";

export type CurrencyCode = string;

export type PaymentMethod = "stripe" | "cod" | "telegram_transfer";

export {
  COUNTRY_COOKIE_NAME,
  COUNTRY_HEADER,
  countries,
  defaultCountry,
  geoCountryHeaderNames,
};

export const isCountryCode = (
  value: string | null | undefined,
): value is CountryCode =>
  Boolean(value && countries.includes(value as BuiltInCountryCode));

export const getCountryShortLabel = (country: CountryCode) => country;

export const getCountryDisplayName = (
  locale: string,
  country: string,
): string =>
  new Intl.DisplayNames([locale], { type: "region" }).of(country) ?? country;

export const isIsoCountryCode = (value: unknown): value is string =>
  typeof value === "string" &&
  (ALL_COUNTRY_CODES as readonly string[]).includes(value);

export const getAllCountriesSorted = (
  locale: string,
): { code: string; label: string }[] =>
  ALL_COUNTRY_CODES.map((code) => ({
    code,
    label: getCountryDisplayName(locale, code),
  })).sort((a, b) => a.label.localeCompare(b.label, locale));

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

// Shipping config is not admin-managed yet, so unknown regions fall back to a
// zero (free) config instead of crashing on a missing map entry.
export const getRegionShipping = (country: CountryCode) =>
  countryShippingConfig[country] ?? {
    freeShippingThreshold: 0,
    shippingPrice: 0,
  };

// New countries default to Stripe; only regions where Stripe is unavailable
// (e.g. BY) opt into alternative methods explicitly.
const defaultPaymentMethods: PaymentMethod[] = ["stripe"];

const countryPaymentMethods: Partial<Record<CountryCode, PaymentMethod[]>> = {
  US: defaultPaymentMethods,
  BY: ["cod", "telegram_transfer"],
};

export const getCountryPaymentMethods = (
  country: CountryCode,
): PaymentMethod[] => countryPaymentMethods[country] ?? defaultPaymentMethods;

export const isPaymentMethodAvailable = (
  country: CountryCode,
  method: PaymentMethod,
): boolean => getCountryPaymentMethods(country).includes(method);

export const getCountryFromGeoCode = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  const code = value.trim().toUpperCase();

  return isIsoCountryCode(code) ? code : null;
};

export const getCountryFromGeoHeaders = (headers: Headers) => {
  const headerValue = geoCountryHeaderNames
    .map((headerName) => headers.get(headerName))
    .find(Boolean);

  return getCountryFromGeoCode(headerValue);
};

export const readCountryCookie = (
  cookieHeader: string | null,
): string | null => {
  if (!cookieHeader) {
    return null;
  }

  return (
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${COUNTRY_COOKIE_NAME}=`))
      ?.split("=")[1] ?? null
  );
};

export const getCountryFromCookieHeader = (cookieHeader: string | null) => {
  const countryCookie = readCountryCookie(cookieHeader);

  return isCountryCode(countryCookie) ? countryCookie : null;
};
