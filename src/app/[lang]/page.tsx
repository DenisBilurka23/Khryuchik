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
import { getRequestCountry } from "@/server/country/request-country";
import { DEFAULT_ENTERTAINMENT_CATEGORY } from "@/constants/entertainment";
import { isEntertainmentCategory } from "@/utils";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import type { Locale } from "@/i18n/config";

type HomeDataProps = {
  locale: Locale;
  country: ReturnType<typeof getRequestCountry>;
};

const HomeBooks = async ({ locale, country }: HomeDataProps) => {
  const books = await getProductsForPlacement(
    locale,
    await country,
    "home-books",
  );

  return books.length > 0 ? (
    <BookSection locale={locale} books={books} />
  ) : null;
};

type HomeShopProps = HomeDataProps & {
  category?: string;
};

const HomeShop = async ({ locale, country, category }: HomeShopProps) => {
  const resolvedCountry = await country;
  const shopCategories = await getHomeTabCategories(locale, resolvedCountry);
  const defaultShopCategory = shopCategories[0]?.key ?? "all";
  const selectedShopCategory =
    category && shopCategories.some((item) => item.key === category)
      ? category
      : defaultShopCategory;
  const shopProducts = await getShopProducts(locale, resolvedCountry, {
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
  const country = getRequestCountry();

  return (
    <HomePageView
      locale={locale}
      books={
        <Suspense fallback={<HomeSectionSkeleton kind="books" />}>
          <HomeBooks locale={locale} country={country} />
        </Suspense>
      }
      shop={
        <Suspense fallback={<HomeSectionSkeleton kind="shop" />}>
          <HomeShop locale={locale} country={country} category={category} />
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
