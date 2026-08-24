export const geoCountryHeaderNames = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "cloudfront-viewer-country",
  "x-country-code",
  "x-country",
  "x-geo-country",
] as const;

// Countries whose postal address is incomplete without a region, and what that
// region is called there. One map rather than a list plus a naming table: a
// country that needs a region always has a word for it, and two lists would
// drift apart.
//
// US and CA are verified - Chit Chats answers `province_code field is invalid`
// for a destination in either without one. MX and AU come from Easyship's
// documented requirement.
export const REGION_LABEL_BY_COUNTRY: Record<string, "state" | "province"> = {
  US: "state",
  CA: "province",
  MX: "state",
  AU: "state",
};

export const defaultCountry = "US" as const;

export const COUNTRY_COOKIE_NAME = "khryuchik-country";

export const COUNTRY_HEADER = "x-khryuchik-country";

export const COUNTRY_CHANGE_EVENT = "khryuchik-country-change";
