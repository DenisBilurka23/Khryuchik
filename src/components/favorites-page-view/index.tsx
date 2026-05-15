"use client";

import { Box, Container, Paper } from "@mui/material";
import { useTranslations } from "next-intl";

import { useWishlist } from "@/hooks/useWishlist";
import { getCountLabel } from "@/utils";

import { useCart } from "../cart/store";
import { FavoritesEmptyState } from "./empty-state";
import { FavoritesHero } from "./hero";
import type { FavoritesPageViewProps } from "./types";
import { FavoritesWishlistGrid } from "./wishlist-grid";
import type { ResolvedWishlistItem } from "./wishlist-grid";

export const FavoritesPageView = ({
  locale,
  categoryLabels,
  isAuthenticated: initialIsAuthenticated,
  shopHref,
  loginHref,
  registerHref,
}: FavoritesPageViewProps) => {
  const tFavorites = useTranslations("storefront.favoritesPage");
  const { addItem } = useCart();
  const { items, ids, isLoading, isAuthenticated, toggleWishlist } = useWishlist();
  const authState = isAuthenticated || initialIsAuthenticated;
  const resolvedItems = items.filter(
    (item): item is ResolvedWishlistItem => Boolean(item.product),
  );
  const countLabel = getCountLabel(
    ids.length,
    locale,
    tFavorites.raw("itemCount") as Parameters<typeof getCountLabel>[2],
  );

  const addAllToCart = () => {
    resolvedItems.forEach((item) => {
      addItem({
        productId: item.productId,
        quantity: 1,
      });
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <FavoritesHero
        locale={locale}
        authState={authState}
        countLabel={countLabel}
        shopHref={shopHref}
        loginHref={loginHref}
        registerHref={registerHref}
        onAddAllToCart={addAllToCart}
        isAddAllDisabled={resolvedItems.length === 0}
      />

      <Box sx={{ mt: 4.5 }}>
        {isLoading ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: "28px", border: "1px solid #F0DFC8", bgcolor: "#fff" }}>
            {locale === "ru" ? "Загружаем избранное..." : "Loading wishlist..."}
          </Paper>
        ) : resolvedItems.length === 0 ? (
          <FavoritesEmptyState authState={authState} shopHref={shopHref} />
        ) : (
          <FavoritesWishlistGrid
            locale={locale}
            authState={authState}
            categoryLabels={categoryLabels}
            items={resolvedItems}
            onAddToCart={(productId: string) => {
              addItem({ productId, quantity: 1 });
            }}
            onToggleWishlist={toggleWishlist}
          />
        )}
      </Box>
    </Container>
  );
};

export type { FavoritesPageViewProps } from "./types";