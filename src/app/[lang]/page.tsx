import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { Storefront } from "@/components/storefront";
import {
  getHomeTabCategories,
  getProductsForPlacement,
  getShopProducts,
} from "@/data/products";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { getRequestCountry } from "@/server/country/request-country";

type LocalizedPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedPageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const [tMetadata, tBrand] = await Promise.all([
    getTranslations({ locale: lang, namespace: "metadata" }),
    getTranslations({ locale: lang, namespace: "storefront.brand" }),
  ]);

  return {
    title: tMetadata("title"),
    description: tMetadata("description"),
    alternates: {
      canonical: lang === defaultLocale ? "/" : `/${lang}`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/" : `/${locale}`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      locale: lang,
      title: tMetadata("title"),
      description: tMetadata("description"),
      siteName: tBrand("title"),
    },
  };
};

const LocalizedHome = async ({ params, searchParams }: LocalizedPageProps) => {
  const { lang } = await params;
  const { category } = await searchParams;

  if (!isLocale(lang)) {
    notFound();
  }

  const country = await getRequestCountry();
  const [books, shopCategories] = await Promise.all([
    getProductsForPlacement(lang, country, "home-books"),
    getHomeTabCategories(lang),
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
      country={country}
      shopCategories={shopCategories}
      books={books}
      shopProducts={shopProducts}
      selectedShopCategory={selectedShopCategory}
    />
  );
};

export default LocalizedHome;