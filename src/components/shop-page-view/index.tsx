import { Box, Breadcrumbs, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CategoryTabs } from "@/components/category-tabs";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { BOOK_SERIES, BOOKS_CATEGORY_KEY } from "@/constants/catalog";
import { getLocalizedProductPath } from "@/utils";
import {
  createShopPageViewModel,
  isBookSeries,
  isShopFilterValue,
} from "@/utils/shop-page";

import { NewsletterSection } from "../newsletter-section";
import { ProductCard } from "../product-card";
import { ShopSearchField } from "../shop-search-field";
import shellStyles from "../storefront/storefront.module.css";

import { ShopHero } from "./shop-hero";
import styles from "./shop-page-view.module.css";
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
    <Box className={shellStyles.pageShell} sx={{ color: "text.primary" }}>
      <Box className={shellStyles.pageContent}>
        <Box component="section" className={styles.section}>
          <Container maxWidth="lg">
            <Breadcrumbs separator="→" className={styles.breadcrumbs}>
              <Link href={homeHref} className={styles.breadcrumbLink}>
                {tShopPage("breadcrumbs.home")}
              </Link>
              <Typography component="span" className={styles.breadcrumbCurrent}>
                {tShopPage("breadcrumbs.current")}
              </Typography>
            </Breadcrumbs>

            <ShopHero
              eyebrow={tShopPage("hero.eyebrow")}
              title={tShopPage("hero.title")}
              lead={tShopPage("hero.lead")}
            />

            <Box className={styles.catalog}>
              <SectionEyebrow label={tShopPage("catalog.eyebrow")} />

              <Typography variant="h2" className={styles.catalogTitle}>
                {tShopPage("catalog.title")}
              </Typography>

              <CategoryTabs
                selectedValue={selectedFilter}
                options={filters}
                preserveQueryParams={["q"]}
                className={styles.filters}
              />

              {showSeriesFilter ? (
                <CategoryTabs
                  variant="text"
                  label={tShopPage("seriesFilterLabel")}
                  selectedValue={selectedSeries}
                  options={seriesFilters}
                  queryParamName="series"
                  preserveQueryParams={["q", "category"]}
                  className={styles.seriesFilters}
                />
              ) : null}

              <Box className={styles.toolbar}>
                <Typography component="p" className={styles.resultsLabel}>
                  {tShopPage("resultsLabel")}: {filteredProducts.length}
                </Typography>

                <Box className={styles.search}>
                  <ShopSearchField
                    initialValue={search}
                    placeholder={tShopPage("searchPlaceholder")}
                  />
                </Box>
              </Box>

              {filteredProducts.length > 0 ? (
                <Box className={styles.grid}>
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
                <Box className={styles.empty}>
                  <Typography component="p" className={styles.emptyTitle}>
                    {tShopPage(
                      isRegionEmpty ? "emptyRegionTitle" : "emptyTitle",
                    )}
                  </Typography>
                  <Typography component="p" className={styles.emptyText}>
                    {tShopPage(isRegionEmpty ? "emptyRegionText" : "emptyText")}
                  </Typography>
                  {isRegionEmpty ? null : (
                    <Link href={shopHref}>
                      <Button
                        component="span"
                        variant="outlined"
                        className={styles.emptyAction}
                      >
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
      </Box>
    </Box>
  );
};

export type {
  CreateShopPageViewModelParams,
  ShopFilterValue,
  ShopPageViewProps,
} from "./types";
