"use client";

import { Box, Container, Paper } from "@mui/material";
import { useTranslations } from "next-intl";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { useWishlist } from "@/hooks/useWishlist";
import { getLocalizedPath, isPurchasableAvailability } from "@/utils";

import { useCart } from "../cart/store";
import { FavoritesEmptyState } from "./empty-state";
import styles from "./favorites-page-view.module.css";
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
  const t = useTranslations("storefront.favoritesPage");
  const { addItem } = useCart();
  const { items, isLoading, isAuthenticated } = useWishlist();
  const authState = isAuthenticated || initialIsAuthenticated;
  const resolvedItems = items.filter((item): item is ResolvedWishlistItem =>
    Boolean(item.product),
  );
  const purchasableItems = resolvedItems.filter((item) =>
    isPurchasableAvailability(item.product.availability),
  );
  const addAllToCart = () => {
    purchasableItems.forEach((item) => {
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
        isAddAllDisabled={purchasableItems.length === 0}
      />

      <Box className={styles.content}>
        {isLoading ? (
          <Paper elevation={0} className={styles.loading}>
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
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg">
        <Breadcrumbs
          items={[
            {
              label: t("breadcrumbs.home"),
              href: getLocalizedPath(locale, "/"),
            },
            { label: t("breadcrumbs.current") },
          ]}
        />

        {content}
      </Container>
    </Box>
  );
};

export type { FavoritesPageViewProps } from "./types";
