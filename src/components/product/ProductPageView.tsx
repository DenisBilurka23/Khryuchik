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

import { FooterSection } from "../footer-section";
import { NewsletterSection } from "../newsletter-section";
import { StorefrontHeader } from "../storefront-header";
import { StorefrontThemeProvider } from "../storefront-theme-provider";
import styles from "../storefront.module.css";
import { formatCurrency, getLocalizedPath, getLocalizedProductPath } from "../utils";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductTabs } from "./ProductTabs";
import { RelatedProducts } from "./RelatedProducts";
import { StoryConnectionCard } from "./StoryConnectionCard";
import type { ProductPageViewProps } from "./types";

const createProductPageViewModel = ({
  locale,
  product,
  relatedProducts,
}: {
  locale: Locale;
  product: ProductPageViewProps["product"];
  relatedProducts: ProductPageViewProps["relatedProducts"];
}) => ({
  homeHref: getLocalizedPath(locale, "/"),
  shopHref: getLocalizedPath(locale, "/shop"),
  bookHref: getLocalizedPath(locale, "/products/book-winter"),
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
    bgColor: relatedProduct.bgColor ?? "#FFF8F0",
    formattedPrice: formatCurrency(relatedProduct.price, locale),
  })),
});

export const ProductPageView = ({
  locale,
  dictionary,
  product,
  relatedProducts,
}: ProductPageViewProps) => {
  const { homeHref, shopHref, bookHref, localizedPaths, relatedProductCards } =
    createProductPageViewModel({
      locale,
      product,
      relatedProducts,
    });

  return (
    <StorefrontThemeProvider>
      <Box className={styles.pageShell} sx={{ color: "text.primary" }}>
        <Box className={styles.pageContent}>
          <StorefrontHeader
            locale={locale}
            dictionary={dictionary}
            homeHref={homeHref}
            localizedPaths={localizedPaths}
            navigationPaths={{
              books: getLocalizedPath(locale, "/shop?category=books"),
              shop: shopHref,
              story: `${homeHref}#story`,
              faq: `${homeHref}#faq`,
              cart: getLocalizedPath(locale, "/cart"),
            }}
          />

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
                    product={product}
                  />
                </Grid>
              </Grid>

              <StoryConnectionCard
                storyTitle={product.storyTitle}
                description={dictionary.productPage.storyConnection.description}
                buttonHref={bookHref}
                labels={dictionary.productPage}
              />
              <ProductTabs labels={dictionary.productPage} product={product} />
              <RelatedProducts
                labels={dictionary.productPage}
                relatedProducts={relatedProductCards}
              />
            </Container>
          </Box>

          <NewsletterSection dictionary={dictionary} />
          <FooterSection dictionary={dictionary} />
        </Box>
      </Box>
    </StorefrontThemeProvider>
  );
};
