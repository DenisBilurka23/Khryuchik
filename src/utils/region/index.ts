import { REGION_CODES, REGION_COOKIE_NAME } from "@/constants/region";
import {
  EUROPE_HUB_COUNTRIES,
  NORTH_AMERICA_HUB_COUNTRIES,
} from "@/constants/shipping";
import type { RegionCode } from "@/types/localization";

import type { CountryCode, PaymentMethod } from "../country";

export type { RegionCode } from "@/types/localization";

export {
  DEFAULT_REGION,
  REGION_CODES,
  REGION_COOKIE_NAME,
} from "@/constants/region";

export const isRegionCode = (value: unknown): value is RegionCode =>
  typeof value === "string" &&
  (REGION_CODES as readonly string[]).includes(value);

export const getRegionForCountry = (
  country: CountryCode,
): RegionCode | null => {
  const code = country.toUpperCase();

  if (NORTH_AMERICA_HUB_COUNTRIES.includes(code)) {
    return "northAmerica";
  }

  return EUROPE_HUB_COUNTRIES.includes(code) ? "europe" : null;
};

const defaultPaymentMethods: PaymentMethod[] = ["stripe"];

// Regions that pay by something other than a card. Empty since Belarus
// moved to Stripe - kept as the hook a region needs when it cannot.
const regionPaymentMethods: Partial<Record<RegionCode, PaymentMethod[]>> = {};

export const getRegionPaymentMethods = (region: RegionCode): PaymentMethod[] =>
  regionPaymentMethods[region] ?? defaultPaymentMethods;

export const isPaymentMethodAvailable = (
  region: RegionCode,
  method: PaymentMethod,
): boolean => getRegionPaymentMethods(region).includes(method);

export const readRegionCookie = (
  cookieHeader: string | null,
): RegionCode | null => {
  const value = cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${REGION_COOKIE_NAME}=`))
    ?.split("=")[1];

  return isRegionCode(value) ? value : null;
};
