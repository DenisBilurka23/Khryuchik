"use client";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { ProductCard } from "@/components/product-card";
import { getLocalizedProductPath } from "@/utils";

import styles from "./favorites-wishlist-grid.module.css";
import type { FavoritesWishlistGridProps } from "./types";

export const FavoritesWishlistGrid = ({
  locale,
  authState,
  items,
}: FavoritesWishlistGridProps) => {
  const tFavorites = useTranslations("storefront.favoritesPage");
  const tAccount = useTranslations("accountPage");
  const tShopSection = useTranslations("storefront.shopSection");

  return (
    <Box className={styles.panel}>
      <Box className={styles.header}>
        <Typography variant="h2" className={styles.title}>
          {authState ? tAccount("favoritesListTitle") : tFavorites("listTitle")}
        </Typography>

        {!authState ? (
          <Typography className={styles.sub}>
            {tFavorites("guestListText")}
          </Typography>
        ) : null}
      </Box>

      <Box className={styles.grid}>
        {items.map((item) => (
          <ProductCard
            key={item.productId}
            product={item.product}
            locale={locale}
            wishlistAriaLabel={tShopSection("wishlistAriaLabel")}
            outOfStock={tShopSection("outOfStock")}
            viewProduct={tShopSection("viewProduct")}
            detailsHref={getLocalizedProductPath(locale, item.product.slug)}
          />
        ))}
      </Box>
    </Box>
  );
};

export type { FavoritesWishlistGridProps, ResolvedWishlistItem } from "./types";
