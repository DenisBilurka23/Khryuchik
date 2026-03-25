import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ShopPageView } from "@/components/shop-page-view";
import { getShopCategories, getShopProducts } from "@/data/products";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type LocalizedShopPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
};

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export const generateMetadata = async ({
  params,
}: LocalizedShopPageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return {
    title: `${dictionary.storefront.nav.shop} | ${dictionary.storefront.brand.title}`,
    description: dictionary.storefront.shopPage.lead,
    alternates: {
      canonical: lang === defaultLocale ? "/shop" : `/${lang}/shop`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/shop" : `/${locale}/shop`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      locale: lang,
      title: `${dictionary.storefront.nav.shop} | ${dictionary.storefront.brand.title}`,
      description: dictionary.storefront.shopPage.lead,
      siteName: dictionary.storefront.brand.title,
    },
  };
};

const LocalizedShopPage = async ({
  params,
  searchParams,
}: LocalizedShopPageProps) => {
  const { lang } = await params;
  const { category, q } = await searchParams;

  if (!isLocale(lang)) {
    notFound();
  }

  const [dictionary, categories, products] = await Promise.all([
    getDictionary(lang),
    getShopCategories(lang),
    getShopProducts(lang),
  ]);

  return (
    <ShopPageView
      locale={lang}
      dictionary={dictionary.storefront}
      categories={categories}
      products={products}
      initialCategory={category}
      initialQuery={q}
    />
  );
};

export default LocalizedShopPage;
