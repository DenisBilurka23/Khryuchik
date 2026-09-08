import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryTabs } from "@/components/category-tabs";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { BOOK_SERIES, BOOKS_CATEGORY_KEY } from "@/constants/catalog";
import { displayFont, leadSx } from "@/theme/sx";
import { getLocalizedProductPath } from "@/utils";
import {
  createShopPageViewModel,
  isBookSeries,
  isShopFilterValue,
} from "@/utils/shop-page";

import { NewsletterSection } from "../newsletter-section";
import { ProductCard } from "../product-card";
import { ShopSearchField } from "../shop-search-field";
import { PageShell } from "../storefront/page-shell";
import { ShopHero } from "./shop-hero";
import type {
  ShopFilterValue,
  ShopPageViewProps,
  ShopSeriesFilterValue,
} from "./types";

export const ShopPageView = async ({
  locale,
  country,
  categories,
  products,
  initialCategory,
  initialSeries,
  initialQuery,
}: ShopPageViewProps) => {
  const [tShopPage, tShopSection, tBookSeries] = await Promise.all([
    getTranslations({ locale, namespace: "storefront.shopPage" }),
    getTranslations({ locale, namespace: "storefront.shopSection" }),
    getTranslations({ locale, namespace: "storefront.bookSeries" }),
  ]);
  const initialCategoryParam = initialCategory ?? null;
  const selectedFilter: ShopFilterValue = isShopFilterValue(
    initialCategoryParam,
    categories,
  )
    ? initialCategoryParam
    : "all";
  const hasSeriesProducts = products.some((product) => Boolean(product.series));
  const showSeriesFilter =
    hasSeriesProducts && selectedFilter === BOOKS_CATEGORY_KEY;
  const seriesParam = initialSeries ?? null;
  const selectedSeries: ShopSeriesFilterValue =
    showSeriesFilter && isBookSeries(seriesParam) ? seriesParam : "all";
  const seriesLabels = {
    [BOOK_SERIES.small]: tBookSeries("small"),
    [BOOK_SERIES.travel]: tBookSeries("travel"),
  };
  const search = initialQuery ?? "";
  const isRegionEmpty = products.length === 0;
  const { homeHref, shopHref, filters, seriesFilters, filteredProducts } =
    createShopPageViewModel({
      locale,
      country,
      allFilterLabel: tShopPage("filters.all"),
      categories,
      products,
      selectedFilter,
      selectedSeries,
      seriesLabels,
      search,
    });

  return (
    <PageShell>
      <Box component="section" sx={{ pb: 7 }}>
        <Container maxWidth="lg">
          <Breadcrumbs
            items={[
              { label: tShopPage("breadcrumbs.home"), href: homeHref },
              { label: tShopPage("breadcrumbs.current") },
            ]}
          />

          <ShopHero
            eyebrow={tShopPage("hero.eyebrow")}
            title={tShopPage("hero.title")}
            lead={tShopPage("hero.lead")}
          />

          <Box sx={{ mt: { xs: 5, md: 7 } }}>
            <SectionEyebrow label={tShopPage("catalog.eyebrow")} />

            <Typography
              variant="h2"
              sx={{ mt: 1.25, fontSize: { xs: 32, md: 40 }, lineHeight: 1.1 }}
            >
              {tShopPage("catalog.title")}
            </Typography>

            <CategoryTabs
              selectedValue={selectedFilter}
              options={filters}
              preserveQueryParams={["q"]}
              sx={{ mt: 3.5 }}
            />

            {showSeriesFilter ? (
              <CategoryTabs
                variant="text"
                label={tShopPage("seriesFilterLabel")}
                selectedValue={selectedSeries}
                options={seriesFilters}
                queryParamName="series"
                preserveQueryParams={["q", "category"]}
                sx={{ mt: 2.5 }}
              />
            ) : null}

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "stretch", md: "center" },
                justifyContent: "space-between",
                gap: { xs: 2, md: 3 },
                mt: 3.5,
              }}
            >
              <Typography
                component="p"
                sx={{ fontSize: 14, color: "var(--color-text-secondary)" }}
              >
                {tShopPage("resultsLabel")}: {filteredProducts.length}
              </Typography>

              <Box
                sx={{
                  width: { xs: "100%", md: 320 },
                  maxWidth: "100%",
                  flexShrink: 0,
                }}
              >
                <ShopSearchField
                  initialValue={search}
                  placeholder={tShopPage("searchPlaceholder")}
                />
              </Box>
            </Box>

            {filteredProducts.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 3,
                  mt: 3,
                }}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    wishlistAriaLabel={tShopSection("wishlistAriaLabel")}
                    outOfStock={tShopSection("outOfStock")}
                    viewProduct={tShopSection("viewProduct")}
                    detailsHref={getLocalizedProductPath(locale, product.slug)}
                  />
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  mt: 3,
                  p: { xs: "28px 20px", md: 5 },
                  border: "1px dashed var(--color-border)",
                  borderRadius: "var(--radius-panel)",
                  background: "var(--color-card)",
                  textAlign: "center",
                }}
              >
                <Typography
                  component="p"
                  sx={{
                    fontFamily: displayFont,
                    fontSize: 26,
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {tShopPage(isRegionEmpty ? "emptyRegionTitle" : "emptyTitle")}
                </Typography>
                <Typography
                  component="p"
                  sx={{
                    mt: 1.5,
                    ...leadSx,
                  }}
                >
                  {tShopPage(isRegionEmpty ? "emptyRegionText" : "emptyText")}
                </Typography>
                {isRegionEmpty ? null : (
                  <Link href={shopHref}>
                    <Button component="span" variant="outlined" sx={{ mt: 3 }}>
                      {tShopPage("resetFilters")}
                    </Button>
                  </Link>
                )}
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      <NewsletterSection locale={locale} />
    </PageShell>
  );
};

export type {
  CreateShopPageViewModelParams,
  ShopFilterValue,
  ShopPageViewProps,
} from "./types";
