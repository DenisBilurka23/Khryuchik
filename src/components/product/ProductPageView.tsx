import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link as MuiLink,
  Typography,
} from "@mui/material";

import { FooterSection } from "../footer-section";
import { NewsletterSection } from "../newsletter-section";
import { StorefrontHeader } from "../storefront-header";
import { StorefrontThemeProvider } from "../storefront-theme-provider";
import styles from "../storefront.module.css";
import { getLocalizedPath } from "../utils";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductTabs } from "./ProductTabs";
import { RelatedProducts } from "./RelatedProducts";
import { StoryConnectionCard } from "./StoryConnectionCard";
import type { ProductPageViewProps } from "./types";

export const ProductPageView = ({
  locale,
  dictionary,
  product,
}: ProductPageViewProps) => {
  const homeHref = getLocalizedPath(locale, "/");
  const shopHref = getLocalizedPath(locale, "/shop");
  const bookHref = getLocalizedPath(locale, "/products/book-winter");

  return (
    <StorefrontThemeProvider>
      <Box className={styles.pageShell} sx={{ color: "text.primary" }}>
        <Box className={styles.pageContent}>
          <StorefrontHeader
            locale={locale}
            totalCount={0}
            dictionary={dictionary}
            buildLocalizedPath={(targetLocale) =>
              targetLocale === "en"
                ? `/products/${product.slug}`
                : `/${targetLocale}/products/${product.slug}`
            }
            navigationPaths={{
              books: getLocalizedPath(locale, "/shop?category=books"),
              shop: shopHref,
              story: `${homeHref}#story`,
              faq: `${homeHref}#faq`,
              order: `${homeHref}#order`,
            }}
          />

          <Box sx={{ py: { xs: 4, md: 6 } }}>
            <Container maxWidth="lg">
              <Breadcrumbs sx={{ mb: 4 }}>
                <MuiLink underline="hover" color="inherit" href={homeHref}>
                  {dictionary.productPage.breadcrumbs.home}
                </MuiLink>
                <MuiLink underline="hover" color="inherit" href={shopHref}>
                  {dictionary.productPage.breadcrumbs.shop}
                </MuiLink>
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
                dictionary={dictionary}
                labels={dictionary.productPage}
                locale={locale}
                relatedIds={product.relatedIds}
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
