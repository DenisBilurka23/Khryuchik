import "server-only";

import { cookies, headers } from "next/headers";

import {
  ADMIN_LOCALE_COOKIE_NAME,
  LOCALE_HEADER,
  type Locale,
  defaultLocale,
  isLocale,
} from "@/i18n/config";

type LocaleScope = "storefront" | "admin";

type ResolveLocaleOptions = {
  requestLocale?: string | null;
};

const getValidLocale = (value: string | null | undefined): Locale | null =>
  value && isLocale(value) ? value : null;

export const resolveLocale = async (
  scope: LocaleScope,
  options: ResolveLocaleOptions = {},
) => {
  const [requestHeaders, cookieStore] = await Promise.all([headers(), cookies()]);
  const headerLocale = getValidLocale(requestHeaders.get(LOCALE_HEADER));
  const requestLocale = getValidLocale(options.requestLocale);
  const adminCookieLocale = getValidLocale(
    cookieStore.get(ADMIN_LOCALE_COOKIE_NAME)?.value,
  );

  if (scope === "admin") {
    return adminCookieLocale ?? headerLocale ?? defaultLocale;
  }

  return requestLocale ?? headerLocale ?? defaultLocale;
};