import {
  COUNTRY_COOKIE_NAME,
  COUNTRY_HEADER,
  defaultCountry,
  geoCountryHeaderNames,
  REGION_LABEL_BY_COUNTRY,
} from "@/constants/country";
import { ALL_COUNTRY_CODES } from "@/constants/all-country-codes";

export type CountryCode = string;

export type CurrencyCode = string;

export type PaymentMethod = "stripe" | "cod" | "telegram_transfer";

export {
  COUNTRY_COOKIE_NAME,
  COUNTRY_HEADER,
  defaultCountry,
  geoCountryHeaderNames,
};

// Whether an address in this country is incomplete without a region.
export const isRegionRequired = (country: string) =>
  country.toUpperCase() in REGION_LABEL_BY_COUNTRY;

// The dictionary key for this country's region field. Returned as a key rather
// than as text so the two call sites - one holding a labels object, one calling
// the translator - can each use it directly.
export const regionFieldKey = (country: string) => {
  const kind = REGION_LABEL_BY_COUNTRY[country.toUpperCase()];

  if (kind === "province") {
    return "regionProvince" as const;
  }

  return kind === "state" ? ("regionState" as const) : ("region" as const);
};

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

const defaultPaymentMethods: PaymentMethod[] = ["stripe"];

// Countries that pay by something other than a card. Empty since Belarus
// moved to Stripe - kept as the hook a region needs when it cannot.
const countryPaymentMethods: Partial<Record<CountryCode, PaymentMethod[]>> =
  {};

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
