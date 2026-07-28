import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Storefront } from "@/components/storefront";
import { defaultLocale } from "@/i18n/config";
import {
  getProductsForPlacement,
  getShopProducts,
} from "@/server/catalog/services/catalog.service";
import { getHomeTabCategories } from "@/server/catalog/services/categories.service";
import { getRequestCountry } from "@/server/country/request-country";

type HomePageProps = {
  searchParams: Promise<{ category?: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const [tMetadata, tBrand] = await Promise.all([
    getTranslations({ locale: defaultLocale, namespace: "metadata" }),
    getTranslations({ locale: defaultLocale, namespace: "storefront.brand" }),
  ]);

  return {
    title: tMetadata("title"),
    description: tMetadata("description"),
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
      title: tMetadata("title"),
      description: tMetadata("description"),
      siteName: tBrand("title"),
    },
  };
};

const HomePage = async ({ searchParams }: HomePageProps) => {
  const { category } = await searchParams;
  const country = await getRequestCountry();
  const [books, shopCategories] = await Promise.all([
    getProductsForPlacement(defaultLocale, country, "home-books"),
    getHomeTabCategories(defaultLocale, country),
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
      shopCategories={shopCategories}
      books={books}
      shopProducts={shopProducts}
      selectedShopCategory={selectedShopCategory}
    />
  );
};

export default HomePage;
