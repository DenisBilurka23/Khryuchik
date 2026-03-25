import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductPageView } from "@/components/product/ProductPageView";
import {
  getProductDetails,
  getProductSlugs,
  getProductSummariesByIds,
} from "@/data/products";
import { defaultLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = () =>
  getProductSlugs(defaultLocale).then((slugs) =>
    slugs.map((slug) => ({ slug })),
  );

export const generateMetadata = async ({
  params,
}: ProductPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const product = await getProductDetails(defaultLocale, slug);

  if (!product) {
    notFound();
  }

  const dictionary = await getDictionary(defaultLocale);

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
  const product = await getProductDetails(defaultLocale, slug);

  if (!product) {
    notFound();
  }

  const [dictionary, relatedProducts] = await Promise.all([
    getDictionary(defaultLocale),
    getProductSummariesByIds(defaultLocale, product.relatedIds),
  ]);

  return (
    <ProductPageView
      locale={defaultLocale}
      dictionary={dictionary.storefront}
      product={product}
      relatedProducts={relatedProducts}
    />
  );
};

export default DefaultProductPage;
