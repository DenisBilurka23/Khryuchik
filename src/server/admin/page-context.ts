import "server-only";

import { cookies } from "next/headers";

import { ADMIN_LOCALE_COOKIE_NAME, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getRequestCountry } from "@/server/country/request-country";
import { getRequestLocale } from "@/server/i18n/request-locale";

export const getAdminPageContext = async () => {
  const cookieStore = await cookies();
  const adminCookieLocale = cookieStore.get(ADMIN_LOCALE_COOKIE_NAME)?.value;
  const [requestLocale, country] = await Promise.all([
    getRequestLocale(),
    getRequestCountry(),
  ]);
  const locale = adminCookieLocale && isLocale(adminCookieLocale)
    ? adminCookieLocale
    : requestLocale;
  const dictionary = await getDictionary(locale, country);

  return {
    locale,
    country,
    dictionary: dictionary.adminPage,
  };
};