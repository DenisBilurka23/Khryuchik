import type { Metadata } from "next";

import { Storefront } from "@/components/storefront";
import {
  getHomeTabCategories,
  getProductsForPlacement,
  getShopProducts,
} from "@/data/products";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getRequestCountry } from "@/server/country/request-country";

type HomePageProps = {
  searchParams: Promise<{ category?: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const country = await getRequestCountry();
  const dictionary = await getDictionary(defaultLocale, country);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    alternates: {
      canonical: "/",
      languages: {
        en: "/",
        ru: "/ru",
      },
    },
    openGraph: {
      type: "website",
      locale: defaultLocale,
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
      siteName: dictionary.storefront.brand.title,
    },
  };
};

const HomePage = async ({ searchParams }: HomePageProps) => {
  const { category } = await searchParams;
  const country = await getRequestCountry();
  const [dictionary, books, shopCategories] = await Promise.all([
    getDictionary(defaultLocale, country),
    getProductsForPlacement(defaultLocale, country, "home-books"),
    getHomeTabCategories(defaultLocale),
  ]);

  const defaultShopCategory = shopCategories[0]?.key ?? "all";

  const selectedShopCategory =
    category && shopCategories.some((item) => item.key === category)
      ? category
      : defaultShopCategory;
  const shopProducts = await getShopProducts(defaultLocale, country, {
    category: selectedShopCategory === "all" ? undefined : selectedShopCategory,
    limit: 4,
  });

  return (
    <Storefront
      locale={defaultLocale}
      country={country}
      dictionary={dictionary.storefront}
      shopCategories={shopCategories}
      books={books}
      shopProducts={shopProducts}
      selectedShopCategory={selectedShopCategory}
    />
  );
};

export default HomePage;