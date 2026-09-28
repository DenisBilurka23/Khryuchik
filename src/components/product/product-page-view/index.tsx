import {
  Box,
  Container,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageShell } from "@/components/page-shell";
import type { ProductPageLabels } from "@/i18n/types";
import { getAppOrigin } from "@/server/email/transport";
import {
  formatCurrency,
  getLocalizedPath,
  getLocalizedProductPath,
} from "@/utils";

import { ProductGallery } from "../product-gallery";
import { ProductInfo } from "../product-info";
import { ProductInfoSkeleton } from "../product-info-skeleton";
import { ProductTabs } from "../product-tabs";
import { RelatedProducts } from "../related-products";
import { StoryConnectionCard } from "../story-connection-card";
import type { ProductPageViewProps } from "../types";
import { createProductStructuredData } from "./utils";

const storySkeletonSx = {
  mt: 6,
  borderRadius: "var(--radius-hero)",
} as const;

const tabsSkeletonSx = {
  mt: 6,
  borderRadius: "var(--radius-panel)",
} as const;

const ProductInfoContent = async ({
  locale,
  product,
  purchaseContext,
}: Pick<ProductPageViewProps, "locale" | "product" | "purchaseContext">) => {
  const { ownedLanguages } = await purchaseContext;

  return (
    <ProductInfo
      locale={locale}
      product={product}
      ownedLanguages={ownedLanguages}
    />
  );
};

const ProductStoryContent = async ({
  locale,
  storyProducts,
}: Pick<ProductPageViewProps, "locale" | "storyProducts">) => {
  const storyProduct = (await storyProducts)[0];

  if (!storyProduct) {
    return null;
  }

  const tProductPage = await getTranslations({
    locale,
    namespace: "storefront.productPage",
  });

  return (
    <StoryConnectionCard
      product={{
        href: getLocalizedProductPath(locale, storyProduct.slug),
        title: storyProduct.title,
        emoji: storyProduct.emoji,
        thumbnailBackgroundColor: storyProduct.thumbnailBackgroundColor,
      }}
      titleTemplate={tProductPage("storyConnection.title", {
        storyTitle: storyProduct.title,
      })}
      description={tProductPage("storyConnection.description")}
      actionLabel={tProductPage("actions.viewBook")}
    />
  );
};

const ProductTabsContent = async ({
  locale,
  product,
  purchaseContext,
  isAuthenticated,
  userReview,
}: Pick<
  ProductPageViewProps,
  "locale" | "product" | "purchaseContext" | "isAuthenticated" | "userReview"
>) => {
  const [purchase, authenticated, review, tProductPage] = await Promise.all([
    purchaseContext,
    isAuthenticated,
    userReview,
    getTranslations({ locale, namespace: "storefront.productPage" }),
  ]);
  const reviewFormLabels = tProductPage.raw(
    "reviewForm",
  ) as ProductPageLabels["reviewForm"];

  return (
    <ProductTabs
      labels={{
        description: tProductPage("tabs.description"),
        specs: tProductPage("tabs.specs"),
        delivery: tProductPage("tabs.delivery"),
        reviews: tProductPage("tabs.reviews"),
      }}
      product={product}
      ownPendingReview={review?.status === "pending" ? review : null}
      reviewForm={{
        isAuthenticated: authenticated,
        hasDelivered: purchase.hasDeliveredPurchase,
        existingStatus: review?.status ?? null,
        productId: product.productId,
        productSlug: product.slug,
        loginHref: getLocalizedPath(locale, "/login"),
        labels: reviewFormLabels,
      }}
    />
  );
};

const ProductRelatedContent = async ({
  locale,
  relatedProducts,
}: Pick<ProductPageViewProps, "locale" | "relatedProducts">) => {
  const products = await relatedProducts;

  if (products.length === 0) {
    return null;
  }

  const tProductPage = await getTranslations({
    locale,
    namespace: "storefront.productPage",
  });

  return (
    <RelatedProducts
      title={tProductPage("relatedTitle")}
      relatedProducts={products.map((relatedProduct) => ({
        id: relatedProduct.id,
        href: getLocalizedProductPath(locale, relatedProduct.slug),
        title: relatedProduct.title,
        emoji: relatedProduct.emoji,
        thumbnailBackgroundColor:
          relatedProduct.thumbnailBackgroundColor ?? "var(--color-cream)",
        formattedPrice: formatCurrency(
          relatedProduct.price,
          locale,
          relatedProduct.currency,
        ),
      }))}
    />
  );
};

export const ProductPageView = async ({
  locale,
  product,
  relatedProducts,
  storyProducts,
  purchaseContext,
  isAuthenticated,
  userReview,
}: ProductPageViewProps) => {
  const tProductPage = await getTranslations({
    locale,
    namespace: "storefront.productPage",
  });
  const structuredData = createProductStructuredData(
    product,
    locale,
    getAppOrigin(),
  );

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Box>
        <Container maxWidth="lg">
          <Breadcrumbs
            items={[
              {
                label: tProductPage("breadcrumbs.home"),
                href: getLocalizedPath(locale, "/"),
              },
              {
                label: tProductPage("breadcrumbs.shop"),
                href: getLocalizedPath(locale, "/shop"),
              },
              { label: product.title },
            ]}
          />

          <Grid container spacing={5} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 6 }}>
              <ProductGallery images={product.images} />
              <Divider sx={{ my: 3 }} />
              <Stack spacing={1.5}>
                <Typography variant="body2" color="text.secondary">
                  {tProductPage("details.sku")}: {product.sku}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tProductPage("details.securePayment")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tProductPage("details.shipping")}
                </Typography>
                {product.languages?.length ? (
                  <Typography variant="body2" color="text.secondary">
                    {tProductPage("details.languageSupportLabel", {
                      langs: product.languages
                        .map((language) => language.value.toUpperCase())
                        .join(" / "),
                    })}
                  </Typography>
                ) : null}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Suspense
                fallback={
                  <ProductInfoSkeleton locale={locale} product={product} />
                }
              >
                <ProductInfoContent
                  locale={locale}
                  product={product}
                  purchaseContext={purchaseContext}
                />
              </Suspense>
            </Grid>
          </Grid>

          <Suspense
            fallback={
              product.storyProductId ? (
                <Skeleton variant="rounded" height={180} sx={storySkeletonSx} />
              ) : null
            }
          >
            <ProductStoryContent
              locale={locale}
              storyProducts={storyProducts}
            />
          </Suspense>
          <Suspense
            fallback={
              <Skeleton variant="rounded" height={240} sx={tabsSkeletonSx} />
            }
          >
            <ProductTabsContent
              locale={locale}
              product={product}
              purchaseContext={purchaseContext}
              isAuthenticated={isAuthenticated}
              userReview={userReview}
            />
          </Suspense>
          <Suspense fallback={null}>
            <ProductRelatedContent
              locale={locale}
              relatedProducts={relatedProducts}
            />
          </Suspense>
        </Container>
      </Box>
    </PageShell>
  );
};
