import { Box, Container, Grid } from "@mui/material";

import { CategoryTabs } from "../category-tabs";
import { createCategoryTabOptions } from "@/utils/category-tabs";
import { ProductCard } from "../product-card";
import { SectionHeading } from "../section-heading";
import { getLocalizedPath, getLocalizedProductPath } from "@/utils";
import styles from "./shop-section.module.css";
import type { ShopSectionProps } from "./types";

export const ShopSection = ({
  locale,
  categories,
  products,
  dictionary,
  selectedFilter,
}: ShopSectionProps) => {
  const defaultFilterValue = categories[0]?.key;
  const filterOptions = createCategoryTabOptions({
    categories,
    includeAll: false,
  });

  return (
    <Box component="section" id="shop" className={styles.section}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow={dictionary.shopSection.eyebrow}
          title={dictionary.shopSection.title}
          actionLabel={dictionary.shopSection.actionLabel}
          actionHref={getLocalizedPath(locale, "/shop")}
        />

        <CategoryTabs
          selectedValue={selectedFilter}
          options={filterOptions}
          className={styles.filterButton}
          defaultValueWithoutQuery={defaultFilterValue}
          sx={{ mb: 4, display: { xs: "none", md: "flex" } }}
        />

        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, xl: 3 }}>
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
      </Container>
    </Box>
  );
};
