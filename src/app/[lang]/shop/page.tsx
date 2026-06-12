import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ShopPageView } from "@/components/shop-page-view";
import { getShopCategories, getShopProducts } from "@/data/products";
import { defaultLocale, locales } from "@/i18n/config";
import { isActiveLocale } from "@/server/localization/localization.service";
import { getRequestCountry } from "@/server/country/request-country";

type LocalizedShopPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
};

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export const generateMetadata = async ({
  params,
}: LocalizedShopPageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const tStorefront = await getTranslations({ locale: lang, namespace: "storefront" });

  return {
    title: `${tStorefront("nav.shop")} | ${tStorefront("brand.title")}`,
    description: tStorefront("shopPage.lead"),
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
      title: `${tStorefront("nav.shop")} | ${tStorefront("brand.title")}`,
      description: tStorefront("shopPage.lead"),
      siteName: tStorefront("brand.title"),
    },
  };
};

const LocalizedShopPage = async ({
  params,
  searchParams,
}: LocalizedShopPageProps) => {
  const { lang } = await params;
  const { category, q } = await searchParams;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const country = await getRequestCountry();
  const [categories, products] = await Promise.all([
    getShopCategories(lang),
    getShopProducts(lang, country),
  ]);

  return (
    <ShopPageView
      locale={lang}
      country={country}
      categories={categories}
      products={products}
      initialCategory={category}
      initialQuery={q}
    />
  );
};

export default LocalizedShopPage;