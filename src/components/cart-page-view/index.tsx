"use client";

import { Alert, Box, Breadcrumbs, Container, Grid, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { useResolvedCart } from "@/hooks/useResolvedCart";
import { getLocalizedPath } from "@/utils";

import { CartItemCard, EmptyCartState, OrderSummaryCard } from "../cart";
import styles from "../storefront/storefront.module.css";

import type { CartPageViewProps } from "./types";

export const CartPageView = ({
  locale,
  country,
  currency,
}: CartPageViewProps) => {
  const t = useTranslations("storefront.cartPage");
  const cartPage = {
    eyebrow: t("eyebrow"),
    title: t("title"),
    lead: t("lead"),
    breadcrumbs: t.raw("breadcrumbs") as ReturnType<typeof t.raw>,
    emptyState: t.raw("emptyState") as ReturnType<typeof t.raw>,
    itemCard: t.raw("itemCard") as ReturnType<typeof t.raw>,
    pricingUnavailable: t("pricingUnavailable"),
  };
  const {
    items,
    subtotal,
    updateQuantity,
    removeItem,
    isLoading,
    isPricingUnavailable,
    hasStoredItems,
  } = useResolvedCart(locale, country);

  const isDigitalOnly =
    items.length > 0 && items.every((item) => item.isDigital);

  const homeHref = getLocalizedPath(locale, "/");
  const shopHref = getLocalizedPath(locale, "/shop");
  const checkoutHref = getLocalizedPath(locale, "/checkout");

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

    if (item.quantity <= 1) {
      removeItem(id);
      return;
    }

    updateQuantity(id, item.quantity - 1);
  };

  const handleRemove = (id: string) => {
    removeItem(id);
  };

  const discount = 0;

  return (
    <Box className={styles.pageShell} sx={{ color: "text.primary" }}>
      <Box className={styles.pageContent}>
        <Box sx={{ py: { xs: 4, md: 6 } }}>
          <Container maxWidth="lg">
            <Breadcrumbs sx={{ mb: 4 }}>
              <MuiLink component={Link} underline="hover" color="inherit" href={homeHref}>
                {cartPage.breadcrumbs.home}
              </MuiLink>
              <MuiLink component={Link} underline="hover" color="inherit" href={shopHref}>
                {cartPage.breadcrumbs.shop}
              </MuiLink>
              <Typography color="text.primary">
                {cartPage.breadcrumbs.current}
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
                {cartPage.eyebrow}
              </Typography>

              <Typography variant="h1" sx={{ mt: 2, fontSize: { xs: 36, md: 56 } }}>
                {cartPage.title}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 2, maxWidth: 760, lineHeight: 1.8, fontSize: { xs: 16, md: 18 } }}
              >
                {cartPage.lead}
              </Typography>
            </Box>

            {isPricingUnavailable ? (
              <Alert severity="warning" sx={{ mb: 3, borderRadius: "16px" }}>
                {cartPage.pricingUnavailable}
              </Alert>
            ) : null}

            {!hasStoredItems && !isLoading ? (
              <EmptyCartState
                title={cartPage.emptyState.title}
                text={cartPage.emptyState.text}
                actionLabel={cartPage.emptyState.action}
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
                        variantLabel={cartPage.itemCard.variantLabel}
                        removeLabel={cartPage.itemCard.removeLabel}
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
                    currency={currency}
                    subtotal={subtotal}
                    discount={discount}
                    isDigitalOnly={isDigitalOnly}
                    continueShoppingHref={shopHref}
                    checkoutHref={checkoutHref}
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