import type { CountryCode } from "@/utils";

export const BPOST_ZONE = {
  domestic: "domestic",
  franceNetherlands: "france-netherlands",
  neighbours: "neighbours",
  restOfEu: "rest-of-eu",
  restOfEurope: "rest-of-europe",
  mediterraneanNorthAmerica: "mediterranean-north-america",
  restOfWorld: "rest-of-world",
} as const;

export type BpostZone = (typeof BPOST_ZONE)[keyof typeof BPOST_ZONE];

const NEIGHBOUR_COUNTRIES: readonly CountryCode[] = ["DE", "FR", "LU", "NL"];

const REST_OF_EU_COUNTRIES: readonly CountryCode[] = [
  "AT",
  "BG",
  "CY",
  "CZ",
  "DK",
  "EE",
  "ES",
  "FI",
  "GR",
  "HR",
  "HU",
  "IE",
  "IT",
  "LT",
  "LV",
  "MC",
  "MT",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
];

const REST_OF_EUROPE_COUNTRIES: readonly CountryCode[] = [
  "AD",
  "AL",
  "BA",
  "BY",
  "CH",
  "FO",
  "GB",
  "GE",
  "GG",
  "GI",
  "GL",
  "IM",
  "IS",
  "JE",
  "LI",
  "MD",
  "ME",
  "MK",
  "NO",
  "RS",
  "RU",
  "SM",
  "TR",
  "UA",
  "VA",
];

const MEDITERRANEAN_NORTH_AMERICA_COUNTRIES: readonly CountryCode[] = [
  "CA",
  "DZ",
  "EG",
  "IL",
  "JO",
  "MA",
  "SY",
  "TN",
  "US",
];

const BPOST_ORIGIN_COUNTRY = "BE";

export const BPOST_PICKUP_POINT_COUNTRIES: readonly CountryCode[] = [
  "FR",
  "NL",
];

export const resolveBpostZone = (country: CountryCode): BpostZone => {
  const code = country.toUpperCase();

  if (code === BPOST_ORIGIN_COUNTRY) {
    return BPOST_ZONE.domestic;
  }

  if (NEIGHBOUR_COUNTRIES.includes(code)) {
    return BPOST_ZONE.neighbours;
  }

  if (REST_OF_EU_COUNTRIES.includes(code)) {
    return BPOST_ZONE.restOfEu;
  }

  if (REST_OF_EUROPE_COUNTRIES.includes(code)) {
    return BPOST_ZONE.restOfEurope;
  }

  if (MEDITERRANEAN_NORTH_AMERICA_COUNTRIES.includes(code)) {
    return BPOST_ZONE.mediterraneanNorthAmerica;
  }

  return BPOST_ZONE.restOfWorld;
};
