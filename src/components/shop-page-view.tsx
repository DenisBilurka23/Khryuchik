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

import { CategoryTabs } from "@/components/category-tabs";
import type { LocalizedCategory } from "@/types/catalog";

import { NewsletterSection } from "./newsletter-section";
import { ProductCard } from "./product-card";
import { ShopSearchField } from "./shop-search-field";
import type {
  CreateShopPageViewModelParams,
  ShopFilterValue,
  ShopPageViewProps,
} from "./shop-page-view.types";
import styles from "./storefront.module.css";
import { getLocalizedPath, getLocalizedProductPath } from "./utils";

const isShopFilterValue = (
  value: string | null,
  categories: LocalizedCategory[],
): value is ShopFilterValue =>
  value === "all" || categories.some((category) => category.key === value);

const createShopPageViewModel = ({
  locale,
  country,
  dictionary,
  categories,
  products,
  selectedFilter,
  search,
}: CreateShopPageViewModelParams) => {
  void country;

  const homeHref = getLocalizedPath(locale, "/");
  const shopHref = getLocalizedPath(locale, "/shop");
  const filters = [
    {
      value: "all",
      label: dictionary.shopPage.filters.all,
    },
    ...categories.map((category) => ({
      value: category.key,
      label: category.label,
    })),
  ];

  const normalizedSearch = search.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedFilter === "all" || product.category === selectedFilter;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      product.searchIndex.includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  return {
    homeHref,
    shopHref,
    filters,
    filteredProducts,
  };
};

export const ShopPageView = ({
  locale,
  country,
  dictionary,
  categories,
  products,
  initialCategory,
  initialQuery,
}: ShopPageViewProps) => {
  const initialCategoryParam = initialCategory ?? null;
  const selectedFilter: ShopFilterValue = isShopFilterValue(
    initialCategoryParam,
    categories,
  )
    ? initialCategoryParam
    : "all";
  const search = initialQuery ?? "";
  const { homeHref, shopHref, filters, filteredProducts } =
    createShopPageViewModel({
      locale,
      country,
      dictionary,
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
                  {dictionary.shopPage.breadcrumbs.home}
                </MuiLink>
              </Link>
              <Typography color="text.primary">
                {dictionary.shopPage.breadcrumbs.current}
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
                {dictionary.shopPage.eyebrow}
              </Typography>

              <Typography
                variant="h1"
                sx={{ mt: 2, fontSize: { xs: 38, md: 58 }, maxWidth: 800 }}
              >
                {dictionary.shopPage.title}
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
                {dictionary.shopPage.lead}
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
                placeholder={dictionary.shopPage.searchPlaceholder}
              />
            </Stack>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {dictionary.shopPage.resultsLabel}: {filteredProducts.length}
            </Typography>

            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
                  <ProductCard
                    product={product}
                    locale={locale}
                    addToCart={dictionary.shopSection.addToCart}
                    wishlistAriaLabel={dictionary.shopSection.wishlistAriaLabel}
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
                  {dictionary.shopPage.emptyTitle}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                  {dictionary.shopPage.emptyText}
                </Typography>
                <Link href={shopHref}>
                  <Button variant="contained" component="span" sx={{ mt: 3 }}>
                    {dictionary.shopPage.resetFilters}
                  </Button>
                </Link>
              </Box>
            ) : null}
          </Container>
        </Box>

        <NewsletterSection dictionary={dictionary} />
      </Box>
    </Box>
  );
};
