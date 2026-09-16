import type { ReactNode } from "react";
import { getMessages } from "next-intl/server";

import { CartToast } from "@/components/cart";
import { FooterSection } from "@/components/footer-section";
import { IntlClientProvider } from "@/components/providers/intl-client-provider";
import { StorefrontThemeProvider } from "@/components/providers/storefront-theme-provider";
import { StorefrontHeader } from "@/components/storefront-header";
import { createStorefrontHeaderViewModel } from "@/components/storefront-header/navigation";
import { defaultLocale } from "@/i18n/config";
import { getRequestCountry } from "@/server/country/request-country";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import {
  getActiveLocaleCodes,
  getActiveRegionCodes,
} from "@/server/localization/localization.service";

const LocaleLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

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
        <CartToast />
        <FooterSection locale={lang} country={country} />
      </StorefrontThemeProvider>
    </IntlClientProvider>
  );
};

export default LocaleLayout;
