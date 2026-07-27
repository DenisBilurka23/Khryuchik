import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ProductPageView } from "@/components/product";
import { defaultLocale, locales } from "@/i18n/config";
import {
  getProductDetails,
  getProductSummariesByIds,
} from "@/server/catalog/services/catalog.service";
import { getRequestCountry } from "@/server/country/request-country";
import { getServerAuthSession } from "@/server/auth/config";
import { getOwnedProductLanguages } from "@/server/downloads/downloads.service";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
  params,
}: ProductPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const country = await getRequestCountry();
  const product = await getProductDetails(defaultLocale, country, slug);

  if (!product) {
    notFound();
  }

  const tBrand = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront.brand",
  });

  return {
    title: `${product.title} | ${tBrand("title")}`,
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
      siteName: tBrand("title"),
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

  const session = await getServerAuthSession();

  const [relatedProducts, storyProducts, ownedLanguages] = await Promise.all([
    getProductSummariesByIds(defaultLocale, country, product.relatedIds),
    getProductSummariesByIds(
      defaultLocale,
      country,
      product.storyProductId ? [product.storyProductId] : [],
    ),
    session?.user
      ? getOwnedProductLanguages(
          session.user.id || undefined,
          session.user.email ?? undefined,
          product.productId,
        )
      : Promise.resolve<string[]>([]),
  ]);

  return (
    <ProductPageView
      locale={defaultLocale}
      product={product}
      relatedProducts={relatedProducts}
      storyProduct={storyProducts[0] ?? null}
      ownedLanguages={ownedLanguages}
      isAuthenticated={Boolean(session?.user)}
    />
  );
};

export default DefaultProductPage;
