import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { headers } from "next/headers";

import { defaultLocale, isLocale } from "@/i18n/config";
import {
  COUNTRY_HEADER,
  defaultCountry,
  getCountryFromCookieHeader,
  isCountryCode,
} from "@/lib/countries";

import { bodyFont, displayFont } from "./fonts";
import "./globals.css";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const requestHeaders = await headers();
  const requestLocale = requestHeaders.get("x-khryuchik-locale");
  const requestCountry = requestHeaders.get(COUNTRY_HEADER);
  const cookieCountry = getCountryFromCookieHeader(requestHeaders.get("cookie"));
  const locale = requestLocale && isLocale(requestLocale) ? requestLocale : defaultLocale;
  const country = isCountryCode(cookieCountry)
    ? cookieCountry
    : isCountryCode(requestCountry)
      ? requestCountry
      : defaultCountry;

  return (
    <html
      lang={locale}
      data-country={country}
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;