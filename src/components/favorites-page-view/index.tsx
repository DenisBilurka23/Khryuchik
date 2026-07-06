"use client";

import { Box, Container, Paper } from "@mui/material";

import { useWishlist } from "@/hooks/useWishlist";

import { useCart } from "../cart/store";
import { FavoritesEmptyState } from "./empty-state";
import { FavoritesHero } from "./hero";
import type { FavoritesPageViewProps } from "./types";
import { FavoritesWishlistGrid } from "./wishlist-grid";
import type { ResolvedWishlistItem } from "./wishlist-grid";

export const FavoritesPageView = ({
  locale,
  isAuthenticated: initialIsAuthenticated,
  shopHref,
  loginHref,
  registerHref,
  embedded = false,
}: FavoritesPageViewProps) => {
  const { addItem } = useCart();
  const { items, isLoading, isAuthenticated } = useWishlist();
  const authState = isAuthenticated || initialIsAuthenticated;
  const resolvedItems = items.filter(
    (item): item is ResolvedWishlistItem => Boolean(item.product),
  );
  const addAllToCart = () => {
    resolvedItems.forEach((item) => {
      addItem({
        productId: item.productId,
        quantity: 1,
      });
    });
  };

  const content = (
    <>
      <FavoritesHero
        locale={locale}
        authState={authState}
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
            items={resolvedItems}
          />
        )}
      </Box>
    </>
  );

  if (embedded) {
    return <Box>{content}</Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      {content}
    </Container>
  );
};

export type { FavoritesPageViewProps } from "./types";