import { Box } from "@mui/material";

import { BookSection } from "../books-section";
import { HeroSection } from "../hero-section";
import { NewsletterSection } from "../newsletter-section";
import { OrderSection } from "../order-section";
import { ShopSection } from "../shop-section";
import { getRegionCurrency } from "@/server/localization/localization.service";

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
  const currency = await getRegionCurrency(country);

  return (
    <Box className={styles.pageShell} sx={{ color: "text.primary" }}>
      <Box className={styles.pageContent}>
        <HeroSection locale={locale} country={country} currency={currency} />
        {books.length > 0 ? (
          <BookSection locale={locale} books={books} />
        ) : null}
        {shopCategories.length > 0 && shopProducts.length > 0 ? (
          <ShopSection
            locale={locale}
            categories={shopCategories}
            products={shopProducts}
            selectedFilter={selectedShopCategory}
          />
        ) : null}
        <StorySection locale={locale} />
        <OrderSection
          locale={locale}
          country={country}
          currency={currency}
          shopHref={shopHref}
          cartHref={cartHref}
        />
        <NewsletterSection locale={locale} />
      </Box>
    </Box>
  );
};

export type { StorefrontProps } from "./types";
