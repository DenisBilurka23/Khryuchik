import { Box, Button, Container, Grid, Stack } from "@mui/material";

import { ProductCard } from "../product-card";
import { SectionHeading } from "../section-heading";
import styles from "./shop-section.module.css";
import type { ShopSectionProps } from "./types";

export const ShopSection = ({
  locale,
  selectedFilter,
  visibleProducts,
  dictionary,
  setSelectedFilter,
  addToCart,
}: ShopSectionProps) => {
  return (
    <Box component="section" id="shop" className={styles.section}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow={dictionary.shopSection.eyebrow}
          title={dictionary.shopSection.title}
        />

        <Stack
          direction="row"
          spacing={1.5}
          sx={{ mb: 4, display: { xs: "none", md: "flex" } }}
        >
          {dictionary.shopSection.filters.map((filterLabel) => (
            <Button
              key={filterLabel}
              variant="outlined"
              color="inherit"
              onClick={() => setSelectedFilter(filterLabel)}
              className={styles.filterButton}
              sx={{
                borderColor:
                  selectedFilter === filterLabel ? "primary.main" : undefined,
                color:
                  selectedFilter === filterLabel ? "primary.main" : "inherit",
              }}
            >
              {filterLabel}
            </Button>
          ))}
        </Stack>

        <Grid container spacing={3}>
          {visibleProducts.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, xl: 3 }}>
              <ProductCard
                product={product}
                locale={locale}
                addToCart={dictionary.shopSection.addToCart}
                wishlistAriaLabel={dictionary.shopSection.wishlistAriaLabel}
                onAddToCart={addToCart}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
