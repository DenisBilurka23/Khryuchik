import { getMessages } from "next-intl/server";

import { FooterSection } from "@/components/footer-section";
import { NotFoundView } from "@/components/not-found-view";
import { IntlClientProvider } from "@/components/providers/intl-client-provider";
import { StorefrontThemeProvider } from "@/components/providers/storefront-theme-provider";
import { StorefrontHeader } from "@/components/storefront-header";
import { createStorefrontHeaderViewModel } from "@/components/storefront-header/navigation";
import { defaultLocale } from "@/i18n/config";
import { getRequestCountry } from "@/server/country/request-country";
import {
  getActiveLocaleCodes,
  getActiveRegionCodes,
} from "@/server/localization/localization.service";

const NotFound = async () => {
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

  return (
    <IntlClientProvider locale={defaultLocale} messages={messages}>
      <StorefrontThemeProvider>
        <StorefrontHeader
          locale={defaultLocale}
          country={country}
          homeHref="/"
          localizedPaths={localizedPaths}
          availableLocales={availableLocales}
          availableCountries={availableCountries}
          navigationPaths={navigationPaths}
        />
        <NotFoundView />
        <FooterSection locale={defaultLocale} country={country} />
      </StorefrontThemeProvider>
    </IntlClientProvider>
  );
};

export default NotFound;
