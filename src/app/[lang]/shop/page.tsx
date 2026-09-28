import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import {
  ShopCatalog,
  ShopCatalogSkeleton,
  ShopPageView,
} from "@/components/shop-page-view";
import { getShopProducts } from "@/server/catalog/services/catalog.service";
import { getShopCategoriesForRegion } from "@/server/catalog/services/categories.service";
import { getRequestRegion } from "@/server/region/request-region";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import type { Locale } from "@/i18n/config";

type LocalizedShopPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; series?: string; q?: string }>;
};

type ShopCatalogDataProps = {
  locale: Locale;
  category?: string;
  series?: string;
  query?: string;
};

const ShopCatalogData = async ({
  locale,
  category,
  series,
  query,
}: ShopCatalogDataProps) => {
  const region = await getRequestRegion();
  const [categories, products] = await Promise.all([
    getShopCategoriesForRegion(locale, region),
    getShopProducts(locale, region),
  ]);

  return (
    <ShopCatalog
      locale={locale}
      region={region}
      categories={categories}
      products={products}
      initialCategory={category}
      initialSeries={series}
      initialQuery={query}
    />
  );
};

export const generateMetadata = async ({
  params,
}: LocalizedShopPageProps): Promise<Metadata> => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const tStorefront = await getTranslations({
    locale: lang,
    namespace: "storefront",
  });

  return createStorefrontMetadata({
    locale: lang,
    path: "/shop",
    title: `${tStorefront("nav.shop")} | ${tStorefront("brand.title")}`,
    description: tStorefront("shopPage.hero.lead"),
  });
};

const LocalizedShopPage = async ({
  params,
  searchParams,
}: LocalizedShopPageProps) => {
  const { lang } = await params;
  const { category, series, q } = await searchParams;

  const locale = await requireActiveLocale(lang);

  return (
    <ShopPageView locale={locale}>
      <Suspense fallback={<ShopCatalogSkeleton />}>
        <ShopCatalogData
          locale={locale}
          category={category}
          series={series}
          query={q}
        />
      </Suspense>
    </ShopPageView>
  );
};

export default LocalizedShopPage;
