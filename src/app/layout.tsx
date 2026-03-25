import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { headers } from "next/headers";

import { defaultLocale, isLocale } from "@/i18n/config";

import { bodyFont, displayFont } from "./fonts";
import "./globals.css";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const requestHeaders = await headers();
  const requestLocale = requestHeaders.get("x-khryuchik-locale");
  const locale = requestLocale && isLocale(requestLocale) ? requestLocale : defaultLocale;

  return (
    <html lang={locale} className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;