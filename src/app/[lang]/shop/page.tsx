import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ShopPageView } from "@/components/shop-page-view";
import { locales } from "@/i18n/config";
import { getShopProducts } from "@/server/catalog/services/catalog.service";
import { getShopCategoriesForRegion } from "@/server/catalog/services/categories.service";
import { getRequestCountry } from "@/server/country/request-country";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";

type LocalizedShopPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; series?: string; q?: string }>;
};

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

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

  await requireActiveLocale(lang);

  const country = await getRequestCountry();
  const [categories, products] = await Promise.all([
    getShopCategoriesForRegion(lang, country),
    getShopProducts(lang, country),
  ]);

  return (
    <ShopPageView
      locale={lang}
      country={country}
      categories={categories}
      products={products}
      initialCategory={category}
      initialSeries={series}
      initialQuery={q}
    />
  );
};

export default LocalizedShopPage;
