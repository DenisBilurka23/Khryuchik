import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CategoryTabs } from "@/components/category-tabs";
import { getLocalizedProductPath } from "@/utils";
import { createShopPageViewModel, isShopFilterValue } from "@/utils/shop-page";

import { NewsletterSection } from "../newsletter-section";
import { ProductCard } from "../product-card";
import { ShopSearchField } from "../shop-search-field";
import styles from "../storefront/storefront.module.css";

import type { ShopFilterValue, ShopPageViewProps } from "./types";

export const ShopPageView = async ({
  locale,
  country,
  categories,
  products,
  initialCategory,
  initialQuery,
}: ShopPageViewProps) => {
  const [tShopPage, tShopSection] = await Promise.all([
    getTranslations({ locale, namespace: "storefront.shopPage" }),
    getTranslations({ locale, namespace: "storefront.shopSection" }),
  ]);
  const initialCategoryParam = initialCategory ?? null;
  const selectedFilter: ShopFilterValue = isShopFilterValue(
    initialCategoryParam,
    categories,
  )
    ? initialCategoryParam
    : "all";
  const search = initialQuery ?? "";
  const isRegionEmpty = products.length === 0;
  const { homeHref, shopHref, filters, filteredProducts } =
    createShopPageViewModel({
      locale,
      country,
      allFilterLabel: tShopPage("filters.all"),
      categories,
      products,
      selectedFilter,
      search,
    });

  return (
    <Box className={styles.pageShell} sx={{ color: "text.primary" }}>
      <Box className={styles.pageContent}>
        <Box sx={{ py: { xs: 4, md: 6 } }}>
          <Container maxWidth="lg">
            <Breadcrumbs sx={{ mb: 4 }}>
              <Link href={homeHref}>
                <MuiLink component="span" underline="hover" color="inherit">
                  {tShopPage("breadcrumbs.home")}
                </MuiLink>
              </Link>
              <Typography color="text.primary">
                {tShopPage("breadcrumbs.current")}
              </Typography>
            </Breadcrumbs>

            <Box
              sx={{
                borderRadius: "32px",
                p: { xs: 3, md: 5 },
                background:
                  "radial-gradient(circle at top left, rgba(247,201,209,0.45), transparent 30%), radial-gradient(circle at right, rgba(255,224,167,0.45), transparent 28%), #FFF8F0",
                border: "1px solid #F0DFC8",
              }}
            >
              <Typography
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "primary.main",
                }}
              >
                {tShopPage("eyebrow")}
              </Typography>

              <Typography
                variant="h1"
                sx={{ mt: 2, fontSize: { xs: 38, md: 58 }, maxWidth: 800 }}
              >
                {tShopPage("title")}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 2,
                  maxWidth: 760,
                  lineHeight: 1.8,
                  fontSize: { xs: 16, md: 18 },
                }}
              >
                {tShopPage("lead")}
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", md: "center" }}
              spacing={3}
              sx={{ mt: 5, mb: 4 }}
            >
              <CategoryTabs
                selectedValue={selectedFilter}
                options={filters}
                preserveQueryParams={["q"]}
                sx={{ flexWrap: "wrap", rowGap: 1.5 }}
              />

              <ShopSearchField
                initialValue={search}
                placeholder={tShopPage("searchPlaceholder")}
              />
            </Stack>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {tShopPage("resultsLabel")}: {filteredProducts.length}
            </Typography>

            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
                  <ProductCard
                    product={product}
                    locale={locale}
                    addToCart={tShopSection("addToCart")}
                    selectOptions={tShopSection("selectOptions")}
                    wishlistAriaLabel={tShopSection("wishlistAriaLabel")}
                    detailsHref={getLocalizedProductPath(locale, product.slug)}
                  />
                </Grid>
              ))}
            </Grid>

            {filteredProducts.length === 0 ? (
              <Box
                sx={{
                  mt: 6,
                  borderRadius: "28px",
                  border: "1px dashed #E8D6BF",
                  p: 5,
                  textAlign: "center",
                  bgcolor: "#fff",
                }}
              >
                <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
                  {tShopPage(isRegionEmpty ? "emptyRegionTitle" : "emptyTitle")}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                  {tShopPage(isRegionEmpty ? "emptyRegionText" : "emptyText")}
                </Typography>
                {isRegionEmpty ? null : (
                  <Link href={shopHref}>
                    <Button variant="contained" component="span" sx={{ mt: 3 }}>
                      {tShopPage("resetFilters")}
                    </Button>
                  </Link>
                )}
              </Box>
            ) : null}
          </Container>
        </Box>

        <NewsletterSection locale={locale} />
      </Box>
    </Box>
  );
};

export type {
  CreateShopPageViewModelParams,
  ShopFilterValue,
  ShopPageViewProps,
} from "./types";
