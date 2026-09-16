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
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";

type LocalizedPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; entertainment?: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedPageProps): Promise<Metadata> => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const tMetadata = await getTranslations({
    locale: lang,
    namespace: "metadata",
  });

  return createStorefrontMetadata({
    locale: lang,
    path: "/",
    title: tMetadata("title"),
    description: tMetadata("description"),
  });
};

const LocalizedHome = async ({ params, searchParams }: LocalizedPageProps) => {
  const { lang } = await params;
  const { category, entertainment } = await searchParams;

  await requireActiveLocale(lang);

  const country = await getRequestCountry();
  const selectedEntertainmentCategory = isEntertainmentCategory(entertainment)
    ? entertainment
    : DEFAULT_ENTERTAINMENT_CATEGORY;
  const [books, shopCategories, entertainmentView] = await Promise.all([
    getProductsForPlacement(lang, country, "home-books"),
    getHomeTabCategories(lang, country),
    getHomeEntertainmentView(lang, selectedEntertainmentCategory),
  ]);

  const defaultShopCategory = shopCategories[0]?.key ?? "all";

  const selectedShopCategory =
    category && shopCategories.some((item) => item.key === category)
      ? category
      : defaultShopCategory;
  const shopProducts = await getShopProducts(lang, country, {
    category: selectedShopCategory === "all" ? undefined : selectedShopCategory,
    limit: 4,
  });

  return (
    <Storefront
      locale={lang}
      shopCategories={shopCategories}
      books={books}
      shopProducts={shopProducts}
      selectedShopCategory={selectedShopCategory}
      entertainment={entertainmentView}
    />
  );
};

export default LocalizedHome;
