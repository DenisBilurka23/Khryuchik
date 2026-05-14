import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { FooterSection } from "@/components/footer-section";
import { StorefrontHeader } from "@/components/storefront-header";
import { createStorefrontHeaderViewModel } from "@/components/storefront-header/navigation";
import { StorefrontThemeProvider } from "@/components/providers/storefront-theme-provider";
import { isLocale, locales } from "@/i18n/config";
import { getRequestCountry } from "@/server/country/request-country";

export const dynamicParams = false;

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

const LocaleLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const country = await getRequestCountry();
  const { localizedPaths, navigationPaths } =
    createStorefrontHeaderViewModel(lang);
  const homeHref = lang === "en" ? "/" : `/${lang}`;

  return (
    <StorefrontThemeProvider>
      <StorefrontHeader
        locale={lang}
        country={country}
        homeHref={homeHref}
        localizedPaths={localizedPaths}
        navigationPaths={navigationPaths}
      />
      {children}
      <FooterSection locale={lang} country={country} />
    </StorefrontThemeProvider>
  );
};

export default LocaleLayout;
