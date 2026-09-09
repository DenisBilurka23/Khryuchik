"use client";

import { Box, Container } from "@mui/material";
import { useTranslations } from "next-intl";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Plate } from "@/components/primitives";
import { useWishlist } from "@/hooks/useWishlist";
import { getLocalizedPath, isPurchasableAvailability } from "@/utils";

import { PageShell } from "../storefront/page-shell";
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

      <Box sx={{ mt: 3 }}>
        {isLoading ? (
          <Plate
            pad="lg"
            sx={{
              fontSize: 15,
              color: "var(--color-text-secondary)",
            }}
          >
            {locale === "ru" ? "Загружаем избранное..." : "Loading wishlist..."}
          </Plate>
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
    <PageShell>
      <Box component="section">
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
    </PageShell>
  );
};

export type { FavoritesPageViewProps } from "./types";
