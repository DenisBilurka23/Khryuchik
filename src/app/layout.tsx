import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { NextIntlClientProvider } from "next-intl";

import { getDictionary } from "@/i18n/dictionaries";
import { getRequestCountry } from "@/server/country/request-country";
import { resolveLocale } from "@/server/i18n/request-locale";

import { AuthSessionProvider } from "@/components/providers/auth-session-provider";

import { bodyFont, displayFont } from "./fonts";
import "./globals.css";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const [locale, country] = await Promise.all([
    resolveLocale("storefront"),
    getRequestCountry(),
  ]);
  const messages = await getDictionary(locale, country);

  return (
    <html
      lang={locale}
      data-country={country}
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <AppRouterCacheProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthSessionProvider>{children}</AuthSessionProvider>
          </NextIntlClientProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;