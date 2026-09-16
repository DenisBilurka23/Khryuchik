import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  ProductPageView,
  ProductPricingUnavailable,
} from "@/components/product";
import {
  getProductDetails,
  getProductSummariesByIds,
} from "@/server/catalog/services/catalog.service";
import { defaultLocale } from "@/i18n/config";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import { getProductPurchaseContext } from "@/server/downloads/downloads.service";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
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
  const result = await getProductDetails(defaultLocale, country, slug);

  if (result.status === "not-found") {
    notFound();
  }

  const tBrand = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront.brand",
  });

  const title = result.status === "ok" ? result.product.title : result.title;
  const description =
    result.status === "ok" ? result.product.description : undefined;

  return createStorefrontMetadata({
    locale: defaultLocale,
    path: `/products/${slug}`,
    title: `${title} | ${tBrand("title")}`,
    description,
    openGraph: { title },
  });
};

const DefaultProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;
  const country = await getRequestCountry();
  const result = await getProductDetails(defaultLocale, country, slug);

  if (result.status === "not-found") {
    notFound();
  }

  if (result.status === "pricing-unavailable") {
    return (
      <ProductPricingUnavailable locale={defaultLocale} title={result.title} />
    );
  }

  const product = result.product;
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
