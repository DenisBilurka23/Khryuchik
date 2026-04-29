import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link as MuiLink,
  Typography,
} from "@mui/material";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
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
  product,
  relatedProducts,
  storyProduct,
}: {
  locale: Locale;
  product: ProductPageViewProps["product"];
  relatedProducts: ProductPageViewProps["relatedProducts"];
  storyProduct: ProductPageViewProps["storyProduct"];
}) => ({
  homeHref: getLocalizedPath(locale, "/"),
  shopHref: getLocalizedPath(locale, "/shop"),
  localizedPaths: Object.fromEntries(
    locales.map((targetLocale) => [
      targetLocale,
      targetLocale === "en"
        ? `/products/${product.slug}`
        : `/${targetLocale}/products/${product.slug}`,
    ]),
  ) as Record<Locale, string>,
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

export const ProductPageView = ({
  locale,
  country,
  dictionary,
  product,
  relatedProducts,
  storyProduct,
}: ProductPageViewProps) => {
  void country;

  const { homeHref, shopHref, relatedProductCards, storyProductCard } =
    createProductPageViewModel({
      locale,
      product,
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
                  {dictionary.productPage.breadcrumbs.home}
                </MuiLink>
              </Link>
              <Link
                href={shopHref}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <MuiLink underline="hover" color="inherit" component="span">
                  {dictionary.productPage.breadcrumbs.shop}
                </MuiLink>
              </Link>
              <Typography color="text.primary">{product.title}</Typography>
            </Breadcrumbs>

            <Grid container spacing={5} alignItems="flex-start">
              <Grid size={{ xs: 12, md: 6 }}>
                <ProductGallery images={product.images} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <ProductInfo
                  locale={locale}
                  labels={dictionary.productPage}
                  wishlistAriaLabel={dictionary.shopSection.wishlistAriaLabel}
                  product={product}
                />
              </Grid>
            </Grid>

            {storyProductCard ? (
              <StoryConnectionCard
                product={storyProductCard}
                description={dictionary.productPage.storyConnection.description}
                labels={dictionary.productPage}
              />
            ) : null}
            <ProductTabs labels={dictionary.productPage} product={product} />
            {relatedProductCards.length > 0 ? (
              <RelatedProducts
                labels={dictionary.productPage}
                relatedProducts={relatedProductCards}
              />
            ) : null}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};