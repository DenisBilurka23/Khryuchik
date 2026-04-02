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

export const Storefront = ({
  locale,
  country,
  dictionary,
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
        <HeroSection locale={locale} country={country} dictionary={dictionary} />
        <BookSection locale={locale} dictionary={dictionary} books={books} />
        <ShopSection
          locale={locale}
          dictionary={dictionary}
          categories={shopCategories}
          products={shopProducts}
          selectedFilter={selectedShopCategory}
        />
        <StorySection dictionary={dictionary} />
        <OrderSection
          locale={locale}
          country={country}
          dictionary={dictionary}
          shopHref={shopHref}
          cartHref={cartHref}
        />
        <NewsletterSection dictionary={dictionary} />
      </Box>
    </Box>
  );
};

export type { StorefrontProps } from "./types";