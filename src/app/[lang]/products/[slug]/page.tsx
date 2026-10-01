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
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestRegion } from "@/server/region/request-region";
import { getProductPurchaseContext } from "@/server/downloads/downloads.service";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import { getUserReviewForProduct } from "@/server/reviews/services/reviews.service";
import type { ProductPurchaseContext } from "@/types/download";
import type { UserReviewSummary } from "@/types/reviews";

type LocalizedProductPageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedProductPageProps): Promise<Metadata> => {
  const { lang, slug } = await params;

  await requireActiveLocale(lang);

  const region = await getRequestRegion();
  const result = await getProductDetails(lang, region, slug);

  if (result.status === "not-found") {
    notFound();
  }

  const tBrand = await getTranslations({
    locale: lang,
    namespace: "storefront.brand",
  });

  const isPricingUnavailable = result.status === "pricing-unavailable";
  const title = isPricingUnavailable ? result.title : result.product.title;
  const description = isPricingUnavailable
    ? undefined
    : result.product.description;

  return createStorefrontMetadata({
    locale: lang,
    path: `/products/${slug}`,
    title: `${title} | ${tBrand("title")}`,
    description,
    openGraph: { title },
  });
};

const LocalizedProductPage = async ({ params }: LocalizedProductPageProps) => {
  const { lang, slug } = await params;

  await requireActiveLocale(lang);

  const region = await getRequestRegion();
  const result = await getProductDetails(lang, region, slug);

  if (result.status === "not-found") {
    notFound();
  }

  if (result.status === "pricing-unavailable") {
    return <ProductPricingUnavailable locale={lang} title={result.title} />;
  }

  const product = result.product;
  const session = getServerAuthSession();
  const relatedProducts = getProductSummariesByIds(
    lang,
    region,
    product.relatedIds,
  );
  const storyProducts = getProductSummariesByIds(
    lang,
    region,
    product.storyProductId ? [product.storyProductId] : [],
  );
  const purchaseContext = session.then(
    (value): Promise<ProductPurchaseContext> =>
      value?.user
        ? getProductPurchaseContext(
            value.user.id || undefined,
            value.user.email ?? undefined,
            product.productId,
          )
        : Promise.resolve({
            ownedLanguages: [],
            hasDeliveredPurchase: false,
          }),
  );
  const userReview = session.then(
    (value): Promise<UserReviewSummary | null> =>
      value?.user
        ? getUserReviewForProduct(
            value.user.id || undefined,
            product.productId,
            lang,
          )
        : Promise.resolve(null),
  );
  const isAuthenticated = session.then((value) => Boolean(value?.user));

  return (
    <ProductPageView
      locale={lang}
      product={product}
      relatedProducts={relatedProducts}
      storyProducts={storyProducts}
      purchaseContext={purchaseContext}
      isAuthenticated={isAuthenticated}
      userReview={userReview}
      isAvailableInRegion={result.status === "ok"}
    />
  );
};

export default LocalizedProductPage;
