import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CartPageView } from "@/components/cart-page-view";
import { defaultLocale, locales } from "@/i18n/config";
import { getRequestCountry } from "@/server/country/request-country";

export const generateMetadata = async (): Promise<Metadata> => {
  const tStorefront = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront",
  });

  return {
    title: `${tStorefront("cartPage.breadcrumbs.current")} | ${tStorefront("brand.title")}`,
    description: tStorefront("cartPage.lead"),
    alternates: {
      canonical: "/cart",
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/cart" : `/${locale}/cart`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      locale: defaultLocale,
      title: `${tStorefront("cartPage.breadcrumbs.current")} | ${tStorefront("brand.title")}`,
      description: tStorefront("cartPage.lead"),
      siteName: tStorefront("brand.title"),
    },
  };
};

const DefaultCartPage = async () => {
  const country = await getRequestCountry();

  return <CartPageView locale={defaultLocale} country={country} />;
};

export default DefaultCartPage;