import type { Metadata } from "next";

import { ShopPageView } from "@/components/shop-page-view";
import { getShopCategories, getShopProducts } from "@/data/products";
import { defaultLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type DefaultShopPageProps = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const dictionary = await getDictionary(defaultLocale);

  return {
    title: `${dictionary.storefront.nav.shop} | ${dictionary.storefront.brand.title}`,
    description: dictionary.storefront.shopPage.lead,
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
      title: `${dictionary.storefront.nav.shop} | ${dictionary.storefront.brand.title}`,
      description: dictionary.storefront.shopPage.lead,
      siteName: dictionary.storefront.brand.title,
    },
  };
};

const DefaultShopPage = async ({ searchParams }: DefaultShopPageProps) => {
  const { category, q } = await searchParams;
  const [dictionary, categories, products] = await Promise.all([
    getDictionary(defaultLocale),
    getShopCategories(defaultLocale),
    getShopProducts(defaultLocale),
  ]);

  return (
    <ShopPageView
      locale={defaultLocale}
      dictionary={dictionary.storefront}
      categories={categories}
      products={products}
      initialCategory={category}
      initialQuery={q}
    />
  );
};

export default DefaultShopPage;
