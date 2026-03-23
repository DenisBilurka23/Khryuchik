import type { Metadata } from "next";

import { CartPageView } from "@/components/cart-page-view";
import { defaultLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export const generateMetadata = async (): Promise<Metadata> => {
  const dictionary = await getDictionary(defaultLocale);

  return {
    title: `${dictionary.storefront.cartPage.breadcrumbs.current} | ${dictionary.storefront.brand.title}`,
    description: dictionary.storefront.cartPage.lead,
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
      title: `${dictionary.storefront.cartPage.breadcrumbs.current} | ${dictionary.storefront.brand.title}`,
      description: dictionary.storefront.cartPage.lead,
      siteName: dictionary.storefront.brand.title,
    },
  };
};

const DefaultCartPage = async () => {
  const dictionary = await getDictionary(defaultLocale);

  return (
    <CartPageView
      locale={defaultLocale}
      dictionary={dictionary.storefront}
    />
  );
};

export default DefaultCartPage;