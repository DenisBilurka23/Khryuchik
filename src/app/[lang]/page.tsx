import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Storefront } from "@/components/storefront";
import {
  getHomeTabCategories,
  getProductsForPlacement,
  getShopProducts,
} from "@/data/products";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

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

  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
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
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
      siteName: dictionary.storefront.brand.title,
    },
  };
};

const LocalizedHome = async ({ params, searchParams }: LocalizedPageProps) => {
  const { lang } = await params;
  const { category } = await searchParams;

  if (!isLocale(lang)) {
    notFound();
  }

  const [dictionary, books, shopCategories] = await Promise.all([
    getDictionary(lang),
    getProductsForPlacement(lang, "home-books"),
    getHomeTabCategories(lang),
  ]);

  const defaultShopCategory = shopCategories[0]?.key ?? "all";

  const selectedShopCategory =
    category && shopCategories.some((item) => item.key === category)
      ? category
      : defaultShopCategory;
  const shopProducts = await getShopProducts(lang, {
    category: selectedShopCategory === "all" ? undefined : selectedShopCategory,
    limit: 4,
  });

  return (
    <Storefront
      locale={lang}
      dictionary={dictionary.storefront}
      shopCategories={shopCategories}
      books={books}
      shopProducts={shopProducts}
      selectedShopCategory={selectedShopCategory}
    />
  );
};

export default LocalizedHome;
