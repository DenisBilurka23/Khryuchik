import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

import { AuthSessionProvider } from "@/components/providers";
import { getRequestCountry } from "@/server/country/request-country";
import { getAppOrigin } from "@/server/email/transport";
import { resolveLocale } from "@/server/i18n/request-locale";

import { bodyFont, displayFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getAppOrigin()),
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const [country, locale] = await Promise.all([
    getRequestCountry(),
    resolveLocale("storefront"),
  ]);

  return (
    <html
      lang={locale}
      data-country={country}
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <AppRouterCacheProvider>
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
