import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";

import { FooterSection } from "@/components/footer-section";
import { IntlClientProvider } from "@/components/providers/intl-client-provider";
import { StorefrontHeader } from "@/components/storefront-header";
import { createStorefrontHeaderViewModel } from "@/components/storefront-header/navigation";
import { StorefrontThemeProvider } from "@/components/providers/storefront-theme-provider";
import { defaultLocale } from "@/i18n/config";
import { getRequestCountry } from "@/server/country/request-country";
import {
  getActiveLocaleCodes,
  getActiveRegionCodes,
  isActiveLocale,
} from "@/server/localization/localization.service";

export const dynamicParams = true;

export const generateStaticParams = async () =>
  (await getActiveLocaleCodes())
    .filter((lang) => lang !== defaultLocale)
    .map((lang) => ({ lang }));

const LocaleLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const [country, messages, availableLocales, availableCountries] =
    await Promise.all([
      getRequestCountry(),
      getMessages({ locale: lang }),
      getActiveLocaleCodes(),
      getActiveRegionCodes(),
    ]);
  const { localizedPaths, navigationPaths } = createStorefrontHeaderViewModel(
    lang,
    availableLocales,
  );
  const homeHref = lang === defaultLocale ? "/" : `/${lang}`;

  return (
    <IntlClientProvider locale={lang} messages={messages}>
      <StorefrontThemeProvider>
        <StorefrontHeader
          locale={lang}
          country={country}
          homeHref={homeHref}
          localizedPaths={localizedPaths}
          availableLocales={availableLocales}
          availableCountries={availableCountries}
          navigationPaths={navigationPaths}
        />
        {children}
        <FooterSection locale={lang} country={country} />
      </StorefrontThemeProvider>
    </IntlClientProvider>
  );
};

export default LocaleLayout;
