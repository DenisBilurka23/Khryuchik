import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductPageView } from "@/components/product";
import {
  getProductDetails,
  getProductSlugs,
  getProductSummariesByIds,
} from "@/data/products";
import { defaultLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getRequestCountry } from "@/server/country/request-country";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = () =>
  getProductSlugs().then((slugs) =>
    slugs.map((slug) => ({ slug })),
  );

export const generateMetadata = async ({
  params,
}: ProductPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const country = await getRequestCountry();
  const product = await getProductDetails(defaultLocale, country, slug);

  if (!product) {
    notFound();
  }

  const dictionary = await getDictionary(defaultLocale, country);

  return {
    title: `${product.title} | ${dictionary.storefront.brand.title}`,
    description: product.description,
    alternates: {
      canonical: `/products/${slug}`,
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
      locale: defaultLocale,
      title: product.title,
      description: product.description,
      siteName: dictionary.storefront.brand.title,
    },
  };
};

const DefaultProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;
  const country = await getRequestCountry();
  const product = await getProductDetails(defaultLocale, country, slug);

  if (!product) {
    notFound();
  }

  const [dictionary, relatedProducts, storyProducts] = await Promise.all([
    getDictionary(defaultLocale, country),
    getProductSummariesByIds(defaultLocale, country, product.relatedIds),
    getProductSummariesByIds(
      defaultLocale,
      country,
      product.storyProductId ? [product.storyProductId] : [],
    ),
  ]);

  return (
    <ProductPageView
      locale={defaultLocale}
      country={country}
      dictionary={dictionary.storefront}
      product={product}
      relatedProducts={relatedProducts}
      storyProduct={storyProducts[0] ?? null}
    />
  );
};

export default DefaultProductPage;