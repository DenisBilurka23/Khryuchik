import type { ReactNode } from "react";

import { FooterSection } from "@/components/footer-section";
import { StorefrontHeader } from "@/components/storefront-header";
import { createStorefrontHeaderViewModel } from "@/components/storefront-header/navigation";
import { StorefrontThemeProvider } from "@/components/providers/storefront-theme-provider";
import { defaultLocale } from "@/i18n/config";
import { getRequestCountry } from "@/server/country/request-country";

const DefaultLayout = async ({ children }: { children: ReactNode }) => {
  const country = await getRequestCountry();
  const { localizedPaths, navigationPaths } =
    createStorefrontHeaderViewModel(defaultLocale);
  const homeHref = "/";

  return (
    <StorefrontThemeProvider>
      <StorefrontHeader
        locale={defaultLocale}
        country={country}
        homeHref={homeHref}
        localizedPaths={localizedPaths}
        navigationPaths={navigationPaths}
      />
      {children}
      <FooterSection locale={defaultLocale} country={country} />
    </StorefrontThemeProvider>
  );
};

export default DefaultLayout;
