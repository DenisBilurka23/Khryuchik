export const geoCountryHeaderNames = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "cloudfront-viewer-country",
  "x-country-code",
  "x-country",
  "x-geo-country",
] as const;

export const defaultCountry = "US" as const;

export const COUNTRY_COOKIE_NAME = "khryuchik-country";

export const COUNTRY_HEADER = "x-khryuchik-country";

export const COUNTRY_CHANGE_EVENT = "khryuchik-country-change";
