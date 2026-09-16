import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Storefront } from "@/components/storefront";
import {
  getProductsForPlacement,
  getShopProducts,
} from "@/server/catalog/services/catalog.service";
import { getHomeTabCategories } from "@/server/catalog/services/categories.service";
import { getHomeEntertainmentView } from "@/server/entertainment/services/entertainment.service";
import { getRequestCountry } from "@/server/country/request-country";
import { DEFAULT_ENTERTAINMENT_CATEGORY } from "@/constants/entertainment";
import { isEntertainmentCategory } from "@/utils";
import { defaultLocale } from "@/i18n/config";
import { createStorefrontMetadata } from "@/server/i18n/metadata";

type HomePageProps = {
  searchParams: Promise<{ category?: string; entertainment?: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const tMetadata = await getTranslations({
    locale: defaultLocale,
    namespace: "metadata",
  });

  return createStorefrontMetadata({
    locale: defaultLocale,
    path: "/",
    title: tMetadata("title"),
    description: tMetadata("description"),
  });
};

const HomePage = async ({ searchParams }: HomePageProps) => {
  const { category, entertainment } = await searchParams;
  const country = await getRequestCountry();
  const selectedEntertainmentCategory = isEntertainmentCategory(entertainment)
    ? entertainment
    : DEFAULT_ENTERTAINMENT_CATEGORY;
  const [books, shopCategories, entertainmentView] = await Promise.all([
    getProductsForPlacement(defaultLocale, country, "home-books"),
    getHomeTabCategories(defaultLocale, country),
    getHomeEntertainmentView(defaultLocale, selectedEntertainmentCategory),
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
      shopCategories={shopCategories}
      books={books}
      shopProducts={shopProducts}
      selectedShopCategory={selectedShopCategory}
      entertainment={entertainmentView}
    />
  );
};

export default HomePage;
