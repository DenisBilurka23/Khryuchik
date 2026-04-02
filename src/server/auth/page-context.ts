import { redirect } from "next/navigation";

import { createStorefrontHeaderViewModel } from "@/components/storefront-header/navigation";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getRequestCountry } from "@/server/country/request-country";

import { getServerAuthSession } from "./config";

export const getGuestAuthPageContext = async (locale: Locale) => {
  const session = await getServerAuthSession();

  if (session) {
    redirect(locale === "en" ? "/account" : `/${locale}/account`);
  }

  const country = await getRequestCountry();
  const dictionary = await getDictionary(locale, country);
  const { localizedPaths, navigationPaths } = createStorefrontHeaderViewModel(locale);

  return {
    country,
    dictionary,
    localizedPaths,
    navigationPaths,
    homeHref: locale === "en" ? "/" : `/${locale}`,
  };
};