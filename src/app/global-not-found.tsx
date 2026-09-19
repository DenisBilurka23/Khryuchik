import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

import { NotFoundView } from "@/components/not-found-view";
import { AuthSessionProvider } from "@/components/providers";
import { StorefrontLayoutShell } from "@/components/storefront-layout-shell";
import { getDictionary } from "@/i18n/dictionaries";
import { getRequestCountry } from "@/server/country/request-country";
import { resolveLocale } from "@/server/i18n/request-locale";

import { bodyFont, displayFont } from "./fonts";
import "./globals.css";

export const generateMetadata = async (): Promise<Metadata> => {
  const [locale, country] = await Promise.all([
    resolveLocale("storefront"),
    getRequestCountry(),
  ]);
  const { brand, notFoundPage } = (await getDictionary(locale, country))
    .storefront;

  return {
    title: `${notFoundPage.title} | ${brand.title}`,
    robots: { index: false, follow: false },
  };
};

const GlobalNotFound = async () => {
  const locale = await resolveLocale("storefront");

  return (
    <html
      lang={locale}
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <AppRouterCacheProvider>
          <AuthSessionProvider>
            <StorefrontLayoutShell locale={locale}>
              <NotFoundView />
            </StorefrontLayoutShell>
          </AuthSessionProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default GlobalNotFound;
