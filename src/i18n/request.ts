import { getRequestConfig } from "next-intl/server";

import { getDictionary } from "@/i18n/dictionaries";
import { getRequestCountry } from "@/server/country/request-country";
import { resolveLocale } from "@/server/i18n/request-locale";

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const resolvedLocale = await resolveLocale("storefront", {
    requestLocale: locale ?? await requestLocale,
  });
  const country = await getRequestCountry();
  const messages = await getDictionary(resolvedLocale, country);

  return {
    locale: resolvedLocale,
    messages,
  };
});