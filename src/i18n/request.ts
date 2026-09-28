import { getRequestConfig } from "next-intl/server";

import { getDictionary } from "@/i18n/dictionaries";
import {
  getRequestRegion,
  getRequestTimeZone,
} from "@/server/region/request-region";
import { resolveLocale } from "@/server/i18n/request-locale";

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const resolvedLocale = await resolveLocale("storefront", {
    requestLocale: locale ?? (await requestLocale),
  });
  const region = await getRequestRegion();
  const messages = await getDictionary(resolvedLocale, region);

  return {
    locale: resolvedLocale,
    messages,
    timeZone: await getRequestTimeZone(),
  };
});
