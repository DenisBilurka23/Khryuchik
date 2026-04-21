import "server-only";

import { headers } from "next/headers";

import { defaultLocale, isLocale } from "@/i18n/config";

const LOCALE_HEADER = "x-khryuchik-locale";

export const getRequestLocale = async () => {
  const requestHeaders = await headers();
  const requestLocale = requestHeaders.get(LOCALE_HEADER);

  return requestLocale && isLocale(requestLocale) ? requestLocale : defaultLocale;
};