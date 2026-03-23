import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductPageView } from "@/components/product/ProductPageView";
import { getProductDetails, getProductSlugs } from "@/data/product-details";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type LocalizedProductPageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export const generateStaticParams = () =>
  locales.flatMap((lang) => getProductSlugs().map((slug) => ({ lang, slug })));

export const generateMetadata = async ({
  params,
}: LocalizedProductPageProps): Promise<Metadata> => {
  const { lang, slug } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const product = getProductDetails(lang, slug);

  if (!product) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

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

  const product = getProductDetails(lang, slug);

  if (!product) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return (
    <ProductPageView
      locale={lang}
      dictionary={dictionary.storefront}
      product={product}
    />
  );
};

export default LocalizedProductPage;
