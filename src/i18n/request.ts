import { getRequestConfig } from "next-intl/server";

import { getDictionary } from "@/i18n/dictionaries";
import { getRequestCountry } from "@/server/country/request-country";
import { resolveLocale } from "@/server/i18n/request-locale";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await resolveLocale("storefront", {
    requestLocale: await requestLocale,
  });
  const country = await getRequestCountry();
  const messages = await getDictionary(locale, country);

  return {
    locale,
    messages,
  };
});