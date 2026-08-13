import { COUNTRY_CHANGE_EVENT } from "@/constants/country";

import { type CountryCode } from "./index";

export { COUNTRY_CHANGE_EVENT } from "@/constants/country";

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
