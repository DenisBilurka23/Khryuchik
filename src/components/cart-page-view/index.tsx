"use client";

import { Box, Breadcrumbs, Container, Grid, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";

import { useResolvedCart } from "@/hooks/useResolvedCart";
import { countryShippingConfig, getLocalizedPath } from "@/utils";

import { CartItemCard } from "../cart/CartItemCard";
import { EmptyCartState } from "../cart/EmptyCartState";
import { OrderSummaryCard } from "../cart/OrderSummaryCard";
import styles from "../storefront/storefront.module.css";

import type { CartPageViewProps } from "./types";

export const CartPageView = ({ locale, country, dictionary }: CartPageViewProps) => {
  const { items, subtotal, updateQuantity, removeItem, isLoading, hasStoredItems } =
    useResolvedCart(locale, country);

  const homeHref = getLocalizedPath(locale, "/");
  const shopHref = getLocalizedPath(locale, "/shop");

  const handleIncrease = (id: string) => {
    const item = items.find((entry) => entry.id === id);

    if (!item) {
      return;
    }

    updateQuantity(id, item.quantity + 1);
  };

  const handleDecrease = (id: string) => {
    const item = items.find((entry) => entry.id === id);

    if (!item) {
      return;
    }

    updateQuantity(id, Math.max(1, item.quantity - 1));
  };

  const handleRemove = (id: string) => {
    removeItem(id);
  };

  const shippingConfig = countryShippingConfig[country];
  const shipping =
    subtotal >= shippingConfig.freeShippingThreshold || subtotal === 0
      ? 0
      : shippingConfig.shippingPrice;
  const discount = 0;

  return (
    <Box className={styles.pageShell} sx={{ color: "text.primary" }}>
      <Box className={styles.pageContent}>
        <Box sx={{ py: { xs: 4, md: 6 } }}>
          <Container maxWidth="lg">
            <Breadcrumbs sx={{ mb: 4 }}>
              <MuiLink component={Link} underline="hover" color="inherit" href={homeHref}>
                {dictionary.cartPage.breadcrumbs.home}
              </MuiLink>
              <MuiLink component={Link} underline="hover" color="inherit" href={shopHref}>
                {dictionary.cartPage.breadcrumbs.shop}
              </MuiLink>
              <Typography color="text.primary">
                {dictionary.cartPage.breadcrumbs.current}
              </Typography>
            </Breadcrumbs>

            <Box
              sx={{
                borderRadius: "32px",
                p: { xs: 3, md: 5 },
                background:
                  "radial-gradient(circle at top left, rgba(247,201,209,0.45), transparent 30%), radial-gradient(circle at right, rgba(255,224,167,0.45), transparent 28%), #FFF8F0",
                border: "1px solid #F0DFC8",
                mb: 5,
              }}
            >
              <Typography
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "primary.main",
                }}
              >
                {dictionary.cartPage.eyebrow}
              </Typography>

              <Typography variant="h1" sx={{ mt: 2, fontSize: { xs: 36, md: 56 } }}>
                {dictionary.cartPage.title}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 2, maxWidth: 760, lineHeight: 1.8, fontSize: { xs: 16, md: 18 } }}
              >
                {dictionary.cartPage.lead}
              </Typography>
            </Box>

            {!hasStoredItems && !isLoading ? (
              <EmptyCartState
                title={dictionary.cartPage.emptyState.title}
                text={dictionary.cartPage.emptyState.text}
                actionLabel={dictionary.cartPage.emptyState.action}
                actionHref={shopHref}
              />
            ) : isLoading ? (
              <Box
                sx={{
                  borderRadius: "24px",
                  border: "1px solid #F0DFC8",
                  bgcolor: "#fff",
                  p: 4,
                }}
              >
                <Typography color="text.secondary">Loading cart...</Typography>
              </Box>
            ) : (
              <Grid container spacing={4} alignItems="flex-start">
                <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                  <Box sx={{ display: "grid", gap: 3 }}>
                    {items.map((item) => (
                      <CartItemCard
                        key={item.id}
                        item={item}
                        locale={locale}
                        variantLabel={dictionary.cartPage.itemCard.variantLabel}
                        removeLabel={dictionary.cartPage.itemCard.removeLabel}
                        onIncrease={handleIncrease}
                        onDecrease={handleDecrease}
                        onRemove={handleRemove}
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 5, lg: 4 }}>
                  <OrderSummaryCard
                    locale={locale}
                    country={country}
                    labels={dictionary.cartPage.summary}
                    subtotal={subtotal}
                    shipping={shipping}
                    discount={discount}
                    continueShoppingHref={shopHref}
                  />
                </Grid>
              </Grid>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export type { CartPageViewProps } from "./types";