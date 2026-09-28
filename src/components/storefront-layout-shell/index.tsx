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
  getRequestRegion,
  getRequestTimeZone,
} from "@/server/region/request-region";
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
  const [region, timeZone, messages, availableLocales, availableRegions] =
    await Promise.all([
      getRequestRegion(),
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
          region={region}
          homeHref={locale === defaultLocale ? "/" : `/${locale}`}
          localizedPaths={localizedPaths}
          availableLocales={availableLocales}
          availableRegions={availableRegions}
          navigationPaths={navigationPaths}
        />
        {children}
        <FooterSection locale={locale} region={region} />
      </StorefrontThemeProvider>
    </IntlClientProvider>
  );
};

export type { StorefrontLayoutShellProps } from "./types";
