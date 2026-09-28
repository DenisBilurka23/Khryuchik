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
import { getRequestCountry } from "@/server/country/request-country";
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

  const country = await getRequestCountry();
  const result = await getProductDetails(lang, country, slug);

  if (result.status === "not-found") {
    notFound();
  }

  const tBrand = await getTranslations({
    locale: lang,
    namespace: "storefront.brand",
  });

  const title = result.status === "ok" ? result.product.title : result.title;
  const description =
    result.status === "ok" ? result.product.description : undefined;

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

  const country = await getRequestCountry();
  const result = await getProductDetails(lang, country, slug);

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
    country,
    product.relatedIds,
  );
  const storyProducts = getProductSummariesByIds(
    lang,
    country,
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
    />
  );
};

export default LocalizedProductPage;
