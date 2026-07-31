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
import { getProductPurchaseContext } from "@/server/downloads/downloads.service";
import { getUserReviewForProduct } from "@/server/reviews/services/reviews.service";
import type { ProductPurchaseContext } from "@/types/download";
import type { UserReviewSummary } from "@/types/reviews";

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

  const [relatedProducts, storyProducts, purchaseContext, userReview] =
    await Promise.all([
      getProductSummariesByIds(defaultLocale, country, product.relatedIds),
      getProductSummariesByIds(
        defaultLocale,
        country,
        product.storyProductId ? [product.storyProductId] : [],
      ),
      session?.user
        ? getProductPurchaseContext(
            session.user.id || undefined,
            session.user.email ?? undefined,
            product.productId,
          )
        : Promise.resolve<ProductPurchaseContext>({
            ownedLanguages: [],
            hasPurchased: false,
          }),
      session?.user
        ? getUserReviewForProduct(
            session.user.id || undefined,
            product.productId,
            defaultLocale,
          )
        : Promise.resolve<UserReviewSummary | null>(null),
    ]);

  return (
    <ProductPageView
      locale={defaultLocale}
      country={country}
      product={product}
      relatedProducts={relatedProducts}
      storyProduct={storyProducts[0] ?? null}
      ownedLanguages={purchaseContext.ownedLanguages}
      isAuthenticated={Boolean(session?.user)}
      hasPurchased={purchaseContext.hasPurchased}
      userReview={userReview}
    />
  );
};

export default DefaultProductPage;
