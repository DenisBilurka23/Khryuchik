import { Box, Container, Grid } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { getLocalizedPath, getLocalizedProductPath } from "@/utils";
import { createCategoryTabOptions } from "@/utils/category-tabs";

import { CategoryTabs } from "../category-tabs";
import { ProductCard } from "../product-card";
import { SectionHeading } from "../section-heading";
import type { ShopSectionProps } from "./types";

export const ShopSection = async ({
  locale,
  categories,
  products,
  selectedFilter,
}: ShopSectionProps) => {
  const t = await getTranslations({
    locale,
    namespace: "storefront.shopSection",
  });
  const defaultFilterValue = categories[0]?.key;
  const filterOptions = createCategoryTabOptions({
    categories,
    includeAll: false,
  });

  return (
    <Box component="section" id="shop" sx={{ py: { xs: 1.5, md: 2 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            p: { xs: "24px 20px", md: 4 },
            borderRadius: "var(--radius-panel)",
            background: "var(--color-products)",
          }}
        >
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            actionLabel={t("actionLabel")}
            actionHref={getLocalizedPath(locale, "/shop")}
          />

          <CategoryTabs
            selectedValue={selectedFilter}
            options={filterOptions}
            defaultValueWithoutQuery={defaultFilterValue}
            sx={{ mb: 4, display: { xs: "none", md: "flex" } }}
          />

          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid key={product.id} size={{ xs: 6, md: 4, lg: 3 }}>
                <ProductCard
                  product={product}
                  locale={locale}
                  wishlistAriaLabel={t("wishlistAriaLabel")}
                  outOfStock={t("outOfStock")}
                  viewProduct={t("viewProduct")}
                  detailsHref={getLocalizedProductPath(locale, product.slug)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};
