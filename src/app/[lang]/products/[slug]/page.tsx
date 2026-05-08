import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductPageView } from "@/components/product";
import {
  getProductDetails,
  getProductSummariesByIds,
} from "@/data/products";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getRequestCountry } from "@/server/country/request-country";

type LocalizedProductPageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedProductPageProps): Promise<Metadata> => {
  const { lang, slug } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const country = await getRequestCountry();
  const product = await getProductDetails(lang, country, slug);

  if (!product) {
    notFound();
  }

  const dictionary = await getDictionary(lang, country);

  return {
    title: `${product.title} | ${dictionary.storefront.brand.title}`,
    description: product.description,
    alternates: {
      canonical:
        lang === defaultLocale
          ? `/products/${slug}`
          : `/${lang}/products/${slug}`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale
            ? `/products/${slug}`
            : `/${locale}/products/${slug}`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      locale: lang,
      title: product.title,
      description: product.description,
      siteName: dictionary.storefront.brand.title,
    },
  };
};

const LocalizedProductPage = async ({ params }: LocalizedProductPageProps) => {
  const { lang, slug } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const country = await getRequestCountry();
  const product = await getProductDetails(lang, country, slug);

  if (!product) {
    notFound();
  }

  const [dictionary, relatedProducts, storyProducts] = await Promise.all([
    getDictionary(lang, country),
    getProductSummariesByIds(lang, country, product.relatedIds),
    getProductSummariesByIds(
      lang,
      country,
      product.storyProductId ? [product.storyProductId] : [],
    ),
  ]);

  return (
    <ProductPageView
      locale={lang}
      country={country}
      dictionary={dictionary.storefront}
      product={product}
      relatedProducts={relatedProducts}
      storyProduct={storyProducts[0] ?? null}
    />
  );
};

export default LocalizedProductPage;