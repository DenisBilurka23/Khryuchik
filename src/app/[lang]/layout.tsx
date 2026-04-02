import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { FooterSection } from "@/components/footer-section";
import { StorefrontHeader } from "@/components/storefront-header";
import { StorefrontThemeProvider } from "@/components/providers/storefront-theme-provider";
import { isLocale, locales } from "@/i18n/config";
import { getStorefrontLayoutContext } from "@/server/storefront/layout-context";

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

  const { country, dictionary, localizedPaths, navigationPaths, homeHref } =
    await getStorefrontLayoutContext(lang);

  return (
    <StorefrontThemeProvider>
      <StorefrontHeader
        locale={lang}
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

export default LocaleLayout;
