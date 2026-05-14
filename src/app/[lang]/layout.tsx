import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";

import { FooterSection } from "@/components/footer-section";
import { IntlClientProvider } from "@/components/providers/intl-client-provider";
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

  const [country, messages] = await Promise.all([
    getRequestCountry(),
    getMessages({ locale: lang }),
  ]);
  const { localizedPaths, navigationPaths } =
    createStorefrontHeaderViewModel(lang);
  const homeHref = lang === "en" ? "/" : `/${lang}`;

  return (
    <IntlClientProvider locale={lang} messages={messages}>
      <StorefrontThemeProvider>
        <StorefrontHeader
          locale={lang}
          country={country}
          homeHref={homeHref}
          localizedPaths={localizedPaths}
          navigationPaths={navigationPaths}
        />
        {children}
        <FooterSection locale={lang} />
      </StorefrontThemeProvider>
    </IntlClientProvider>
  );
};

export default LocaleLayout;
