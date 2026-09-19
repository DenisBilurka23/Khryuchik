import { getMessages } from "next-intl/server";

import { FooterSection } from "@/components/footer-section";
import {
  IntlClientProvider,
  StorefrontThemeProvider,
} from "@/components/providers";
import { StorefrontHeader } from "@/components/storefront-header";
import { createStorefrontHeaderViewModel } from "@/components/storefront-header/navigation";
import { defaultLocale } from "@/i18n/config";
import {
  getRequestCountry,
  getRequestTimeZone,
} from "@/server/country/request-country";
import { resolveLocale } from "@/server/i18n/request-locale";
import {
  getActiveLocaleCodes,
  getActiveRegionCodes,
} from "@/server/localization/localization.service";

import type { StorefrontLayoutShellProps } from "./types";

export const StorefrontLayoutShell = async ({
  children,
  locale: localeProp,
}: StorefrontLayoutShellProps) => {
  const locale = localeProp ?? (await resolveLocale("storefront"));
  const [country, timeZone, messages, availableLocales, availableCountries] =
    await Promise.all([
      getRequestCountry(),
      getRequestTimeZone(),
      getMessages({ locale }),
      getActiveLocaleCodes(),
      getActiveRegionCodes(),
    ]);
  const { localizedPaths, navigationPaths } = createStorefrontHeaderViewModel(
    locale,
    availableLocales,
  );

  return (
    <IntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
      <StorefrontThemeProvider>
        <StorefrontHeader
          locale={locale}
          country={country}
          homeHref={locale === defaultLocale ? "/" : `/${locale}`}
          localizedPaths={localizedPaths}
          availableLocales={availableLocales}
          availableCountries={availableCountries}
          navigationPaths={navigationPaths}
        />
        {children}
        <FooterSection locale={locale} country={country} />
      </StorefrontThemeProvider>
    </IntlClientProvider>
  );
};

export type { StorefrontLayoutShellProps } from "./types";
