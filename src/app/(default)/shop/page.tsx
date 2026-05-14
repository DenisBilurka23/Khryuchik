import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ShopPageView } from "@/components/shop-page-view";
import { getShopCategories, getShopProducts } from "@/data/products";
import { defaultLocale, locales } from "@/i18n/config";
import { getRequestCountry } from "@/server/country/request-country";

type DefaultShopPageProps = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const tStorefront = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront",
  });

  return {
    title: `${tStorefront("nav.shop")} | ${tStorefront("brand.title")}`,
    description: tStorefront("shopPage.lead"),
    alternates: {
      canonical: "/shop",
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/shop" : `/${locale}/shop`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      locale: defaultLocale,
      title: `${tStorefront("nav.shop")} | ${tStorefront("brand.title")}`,
      description: tStorefront("shopPage.lead"),
      siteName: tStorefront("brand.title"),
    },
  };
};

const DefaultShopPage = async ({ searchParams }: DefaultShopPageProps) => {
  const { category, q } = await searchParams;
  const country = await getRequestCountry();
  const [categories, products] = await Promise.all([
    getShopCategories(defaultLocale),
    getShopProducts(defaultLocale, country),
  ]);

  return (
    <ShopPageView
      locale={defaultLocale}
      country={country}
      categories={categories}
      products={products}
      initialCategory={category}
      initialQuery={q}
    />
  );
};

export default DefaultShopPage;