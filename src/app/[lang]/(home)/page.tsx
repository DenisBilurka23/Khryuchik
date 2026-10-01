import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { BookSection } from "@/components/books-section";
import { EntertainmentSection } from "@/components/entertainment-section";
import { HomePageView, HomeSectionSkeleton } from "@/components/home-page-view";
import { ShopSection } from "@/components/shop-section";
import {
  getProductsForPlacement,
  getShopProducts,
} from "@/server/catalog/services/catalog.service";
import { getHomeTabCategories } from "@/server/catalog/services/categories.service";
import { getHomeEntertainmentView } from "@/server/entertainment/services/entertainment.service";
import { getRequestRegion } from "@/server/region/request-region";
import { DEFAULT_ENTERTAINMENT_CATEGORY } from "@/constants/entertainment";
import { isEntertainmentCategory } from "@/utils";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import type { Locale } from "@/i18n/config";

type HomeDataProps = {
  locale: Locale;
  region: ReturnType<typeof getRequestRegion>;
};

const HomeBooks = async ({ locale, region }: HomeDataProps) => {
  const books = await getProductsForPlacement(
    locale,
    await region,
    "home-books",
  );

  return books.length > 0 ? (
    <BookSection locale={locale} books={books} />
  ) : null;
};

type HomeShopProps = HomeDataProps & {
  category?: string;
};

const HomeShop = async ({ locale, region, category }: HomeShopProps) => {
  const resolvedRegion = await region;
  const shopCategories = await getHomeTabCategories(locale, resolvedRegion);
  const defaultShopCategory = shopCategories[0]?.key ?? "all";
  const selectedShopCategory =
    category && shopCategories.some((item) => item.key === category)
      ? category
      : defaultShopCategory;
  const shopProducts = await getShopProducts(locale, resolvedRegion, {
    category: selectedShopCategory === "all" ? undefined : selectedShopCategory,
    limit: 4,
  });

  return shopCategories.length > 0 && shopProducts.length > 0 ? (
    <ShopSection
      locale={locale}
      categories={shopCategories}
      products={shopProducts}
      selectedFilter={selectedShopCategory}
    />
  ) : null;
};

type HomeEntertainmentProps = {
  locale: Locale;
  entertainment?: string;
};

const HomeEntertainment = async ({
  locale,
  entertainment,
}: HomeEntertainmentProps) => {
  const selectedCategory = isEntertainmentCategory(entertainment)
    ? entertainment
    : DEFAULT_ENTERTAINMENT_CATEGORY;
  const view = await getHomeEntertainmentView(locale, selectedCategory);

  return view.availableCategories.length > 0 ? (
    <EntertainmentSection locale={locale} entertainment={view} />
  ) : null;
};

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

  const locale = await requireActiveLocale(lang);
  const region = getRequestRegion();

  return (
    <HomePageView
      locale={locale}
      books={
        <Suspense fallback={<HomeSectionSkeleton kind="books" />}>
          <HomeBooks locale={locale} region={region} />
        </Suspense>
      }
      shop={
        <Suspense fallback={<HomeSectionSkeleton kind="shop" />}>
          <HomeShop locale={locale} region={region} category={category} />
        </Suspense>
      }
      entertainment={
        <Suspense fallback={<HomeSectionSkeleton kind="entertainment" />}>
          <HomeEntertainment locale={locale} entertainment={entertainment} />
        </Suspense>
      }
    />
  );
};

export default LocalizedHome;
