import type { ProductShipping } from "@/types/catalog";
import type { ShippingHubCode } from "@/types/shipping";
import type { CountryCode } from "@/utils";

export const NORTH_AMERICA_HUB_COUNTRIES: readonly CountryCode[] = ["CA", "US"];

export const EUROPE_HUB_COUNTRIES: readonly CountryCode[] = [
  "AD",
  "AL",
  "AT",
  "BA",
  "BE",
  "BG",
  "BY",
  "CH",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FO",
  "FR",
  "GB",
  "GE",
  "GG",
  "GI",
  "GL",
  "GR",
  "HR",
  "HU",
  "IE",
  "IM",
  "IS",
  "IT",
  "JE",
  "LI",
  "LT",
  "LU",
  "LV",
  "MC",
  "MD",
  "ME",
  "MK",
  "MT",
  "NL",
  "NO",
  "PL",
  "PT",
  "RO",
  "RS",
  "RU",
  "SE",
  "SI",
  "SK",
  "SM",
  "TR",
  "UA",
  "VA",
];

export const SHIPPING_HUB_CODES: readonly ShippingHubCode[] = [
  "europe",
  "northAmerica",
];

type ShippingBoxPreset = {
  code: "s" | "m" | "l";
  maxBooks: number;
  tareGrams: number;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
};

export const SHIPPING_BOX_PRESETS: readonly ShippingBoxPreset[] = [
  {
    code: "s",
    maxBooks: 2,
    tareGrams: 100,
    lengthMm: 260,
    widthMm: 260,
    heightMm: 50,
  },
  {
    code: "m",
    maxBooks: 6,
    tareGrams: 250,
    lengthMm: 260,
    widthMm: 260,
    heightMm: 100,
  },
  {
    code: "l",
    maxBooks: 12,
    tareGrams: 400,
    lengthMm: 260,
    widthMm: 260,
    heightMm: 160,
  },
];

export const DEFAULT_SHIPPING_ORIGIN_COUNTRY = "CN";

const DEFAULT_BOOK_HS_CODE = "4903000000";

export const DEFAULT_BOOK_SHIPPING: ProductShipping = {
  weightGrams: 500,
  lengthMm: 210,
  widthMm: 148,
  heightMm: 20,
  hubs: ["europe", "northAmerica"],
  originCountry: DEFAULT_SHIPPING_ORIGIN_COUNTRY,
  hsCode: DEFAULT_BOOK_HS_CODE,
};

export const SHIPPING_REQUIRES_TRACKING = true;

export const SHIPPING_FRACTION_DIGITS = 2;
