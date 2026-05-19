import { Box } from "@mui/material";

import { BookSection } from "../books-section";
import { HeroSection } from "../hero-section";
import { NewsletterSection } from "../newsletter-section";
import { OrderSection } from "../order-section";
import { ShopSection } from "../shop-section";
import { createStorefrontHeaderViewModel } from "../storefront-header/navigation";
import { StorySection } from "../story-section";

import styles from "./storefront.module.css";
import type { StorefrontProps } from "./types";

export const Storefront = async ({
  locale,
  country,
  shopCategories,
  books,
  shopProducts,
  selectedShopCategory,
}: StorefrontProps) => {
  const { navigationPaths } = createStorefrontHeaderViewModel(locale);
  const { shop: shopHref, cart: cartHref } = navigationPaths;

  return (
    <Box className={styles.pageShell} sx={{ color: "text.primary" }}>
      <Box className={styles.pageContent}>
        <HeroSection locale={locale} country={country} />
        <BookSection locale={locale} books={books} />
        <ShopSection
          locale={locale}
          categories={shopCategories}
          products={shopProducts}
          selectedFilter={selectedShopCategory}
        />
        <StorySection />
        <OrderSection
          locale={locale}
          country={country}
          shopHref={shopHref}
          cartHref={cartHref}
        />
        <NewsletterSection />
      </Box>
    </Box>
  );
};

export type { StorefrontProps } from "./types";