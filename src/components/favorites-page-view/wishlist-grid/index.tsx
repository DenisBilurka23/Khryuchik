"use client";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { ProductCard } from "@/components/product-card";
import { Panel } from "@/components/primitives";
import { getLocalizedProductPath } from "@/utils";

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
    <Panel tone="cream">
      <Box sx={{ mb: 3.5 }}>
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: 22, md: 26 }, lineHeight: 1.2 }}
        >
          {authState ? tAccount("favoritesListTitle") : tFavorites("listTitle")}
        </Typography>

        {!authState ? (
          <Typography
            sx={{
              mt: 1.25,
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--color-text-secondary)",
            }}
          >
            {tFavorites("guestListText")}
          </Typography>
        ) : null}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          gap: { xs: 2, md: 3 },
        }}
      >
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
    </Panel>
  );
};

export type { FavoritesWishlistGridProps, ResolvedWishlistItem } from "./types";
