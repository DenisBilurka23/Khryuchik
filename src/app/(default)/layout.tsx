import type { ReactNode } from "react";

import { FooterSection } from "@/components/footer-section";
import { StorefrontHeader } from "@/components/storefront-header";
import { StorefrontThemeProvider } from "@/components/providers/storefront-theme-provider";
import { defaultLocale } from "@/i18n/config";
import { getStorefrontLayoutContext } from "@/server/storefront/layout-context";

const DefaultLayout = async ({ children }: { children: ReactNode }) => {
  const { country, dictionary, localizedPaths, navigationPaths, homeHref } =
    await getStorefrontLayoutContext(defaultLocale);

  return (
    <StorefrontThemeProvider>
      <StorefrontHeader
        locale={defaultLocale}
        country={country}
        dictionary={dictionary.storefront}
        homeHref={homeHref}
        localizedPaths={localizedPaths}
        navigationPaths={navigationPaths}
      />
      {children}
      <FooterSection dictionary={dictionary.storefront} />
    </StorefrontThemeProvider>
  );
};

export default DefaultLayout;
