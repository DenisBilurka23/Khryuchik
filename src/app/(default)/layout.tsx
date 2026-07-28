import type { ReactNode } from "react";
import { getMessages } from "next-intl/server";

import { CartToast } from "@/components/cart";
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
} from "@/server/localization/localization.service";

const DefaultLayout = async ({ children }: { children: ReactNode }) => {
  const [country, messages, availableLocales, availableCountries] =
    await Promise.all([
      getRequestCountry(),
      getMessages({ locale: defaultLocale }),
      getActiveLocaleCodes(),
      getActiveRegionCodes(),
    ]);
  const { localizedPaths, navigationPaths } = createStorefrontHeaderViewModel(
    defaultLocale,
    availableLocales,
  );
  const homeHref = "/";

  return (
    <IntlClientProvider locale={defaultLocale} messages={messages}>
      <StorefrontThemeProvider>
        <StorefrontHeader
          locale={defaultLocale}
          country={country}
          homeHref={homeHref}
          localizedPaths={localizedPaths}
          availableLocales={availableLocales}
          availableCountries={availableCountries}
          navigationPaths={navigationPaths}
        />
        {children}
        <CartToast />
        <FooterSection locale={defaultLocale} country={country} />
      </StorefrontThemeProvider>
    </IntlClientProvider>
  );
};

export default DefaultLayout;
