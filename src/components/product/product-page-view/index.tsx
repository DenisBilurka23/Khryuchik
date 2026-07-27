import {
  Box,
  Breadcrumbs,
  Container,
  Divider,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import type { ProductPageLabels } from "@/i18n/types";
import {
  formatCurrency,
  getLocalizedPath,
  getLocalizedProductPath,
} from "@/utils";

import styles from "../../storefront/storefront.module.css";
import { ProductGallery } from "../product-gallery";
import { ProductInfo } from "../product-info";
import { ProductTabs } from "../product-tabs";
import { RelatedProducts } from "../related-products";
import { StoryConnectionCard } from "@/components/product";
import type { ProductPageViewProps } from "../types";

const createProductPageViewModel = ({
  locale,
  relatedProducts,
  storyProduct,
}: {
  locale: Locale;
  relatedProducts: ProductPageViewProps["relatedProducts"];
  storyProduct: ProductPageViewProps["storyProduct"];
}) => ({
  homeHref: getLocalizedPath(locale, "/"),
  shopHref: getLocalizedPath(locale, "/shop"),
  relatedProductCards: relatedProducts.map((relatedProduct) => ({
    id: relatedProduct.id,
    href: getLocalizedProductPath(locale, relatedProduct.slug),
    title: relatedProduct.title,
    emoji: relatedProduct.emoji,
    thumbnailBackgroundColor:
      relatedProduct.thumbnailBackgroundColor ?? "#FFF8F0",
    formattedPrice: formatCurrency(
      relatedProduct.price,
      locale,
      relatedProduct.currency,
    ),
  })),
  storyProductCard: storyProduct
    ? {
        href: getLocalizedProductPath(locale, storyProduct.slug),
        title: storyProduct.title,
        emoji: storyProduct.emoji,
        thumbnailBackgroundColor: storyProduct.thumbnailBackgroundColor,
      }
    : null,
});

export const ProductPageView = async ({
  locale,
  product,
  relatedProducts,
  storyProduct,
  ownedLanguages,
  isAuthenticated,
}: ProductPageViewProps) => {
  const tProductPage = await getTranslations({
    locale,
    namespace: "storefront.productPage",
  });
  const reviewFormLabels = tProductPage.raw(
    "reviewForm",
  ) as ProductPageLabels["reviewForm"];
  const labels = {
    breadcrumbs: {
      home: tProductPage("breadcrumbs.home"),
      shop: tProductPage("breadcrumbs.shop"),
    },
    tabs: {
      description: tProductPage("tabs.description"),
      specs: tProductPage("tabs.specs"),
      delivery: tProductPage("tabs.delivery"),
      reviews: tProductPage("tabs.reviews"),
    },
    relatedTitle: tProductPage("relatedTitle"),
    storyConnection: {
      title: tProductPage("storyConnection.title", {
        storyTitle: storyProduct?.title ?? "",
      }),
      description: tProductPage("storyConnection.description"),
    },
  };

  const { homeHref, shopHref, relatedProductCards, storyProductCard } =
    createProductPageViewModel({
      locale,
      relatedProducts,
      storyProduct,
    });

  return (
    <Box className={styles.pageShell} sx={{ color: "text.primary" }}>
      <Box className={styles.pageContent}>
        <Box sx={{ py: { xs: 4, md: 6 } }}>
          <Container maxWidth="lg">
            <Breadcrumbs sx={{ mb: 4 }}>
              <Link
                href={homeHref}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <MuiLink underline="hover" color="inherit" component="span">
                  {labels.breadcrumbs.home}
                </MuiLink>
              </Link>
              <Link
                href={shopHref}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <MuiLink underline="hover" color="inherit" component="span">
                  {labels.breadcrumbs.shop}
                </MuiLink>
              </Link>
              <Typography color="text.primary">{product.title}</Typography>
            </Breadcrumbs>

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
                        langs: product.languages.map((l) => l.value.toUpperCase()).join(" / "),
                      })}
                    </Typography>
                  ) : null}
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <ProductInfo
                  locale={locale}
                  product={product}
                  ownedLanguages={ownedLanguages}
                />
              </Grid>
            </Grid>

            {storyProductCard ? (
              <StoryConnectionCard
                product={storyProductCard}
                titleTemplate={labels.storyConnection.title}
                description={labels.storyConnection.description}
                actionLabel={tProductPage("actions.viewBook")}
              />
            ) : null}
            <ProductTabs
              labels={labels.tabs}
              product={product}
              reviewForm={{
                isAuthenticated,
                productId: product.productId,
                productSlug: product.slug,
                loginHref: getLocalizedPath(locale, "/login"),
                labels: reviewFormLabels,
              }}
            />
            {relatedProductCards.length > 0 ? (
              <RelatedProducts
                title={labels.relatedTitle}
                relatedProducts={relatedProductCards}
              />
            ) : null}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};