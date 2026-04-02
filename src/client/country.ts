import {
  type CountryCode,
  defaultCountry,
  getCountryFromCookieHeader,
  isCountryCode,
} from "@/utils";

export const COUNTRY_CHANGE_EVENT = "khryuchik-country-change";

export const getClientCountry = () => {
  if (typeof document === "undefined") {
    return defaultCountry;
  }

  const cookieCountry = getCountryFromCookieHeader(document.cookie);

  if (isCountryCode(cookieCountry)) {
    return cookieCountry;
  }

  const country = document.documentElement.dataset.country;

  return isCountryCode(country) ? country : defaultCountry;
};

export const setClientCountry = (country: CountryCode) => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.country = country;

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(COUNTRY_CHANGE_EVENT, {
        detail: { country },
      }),
    );
  }
};