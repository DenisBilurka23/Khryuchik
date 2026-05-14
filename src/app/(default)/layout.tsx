import type { ReactNode } from "react";
import { getMessages } from "next-intl/server";

import { FooterSection } from "@/components/footer-section";
import { IntlClientProvider } from "@/components/providers/intl-client-provider";
import { StorefrontHeader } from "@/components/storefront-header";
import { createStorefrontHeaderViewModel } from "@/components/storefront-header/navigation";
import { StorefrontThemeProvider } from "@/components/providers/storefront-theme-provider";
import { defaultLocale } from "@/i18n/config";
import { getRequestCountry } from "@/server/country/request-country";

const DefaultLayout = async ({ children }: { children: ReactNode }) => {
  const [country, messages] = await Promise.all([
    getRequestCountry(),
    getMessages({ locale: defaultLocale }),
  ]);
  const { localizedPaths, navigationPaths } =
    createStorefrontHeaderViewModel(defaultLocale);
  const homeHref = "/";

  return (
    <IntlClientProvider locale={defaultLocale} messages={messages}>
      <StorefrontThemeProvider>
        <StorefrontHeader
          locale={defaultLocale}
          country={country}
          homeHref={homeHref}
          localizedPaths={localizedPaths}
          navigationPaths={navigationPaths}
        />
        {children}
        <FooterSection locale={defaultLocale} />
      </StorefrontThemeProvider>
    </IntlClientProvider>
  );
};

export default DefaultLayout;
