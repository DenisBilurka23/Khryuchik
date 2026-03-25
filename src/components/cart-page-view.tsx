"use client";

import { Box, Breadcrumbs, Container, Grid, Link as MuiLink, Typography } from "@mui/material";

import { locales, type Locale } from "@/i18n/config";

import { CartItemCard } from "./cart/CartItemCard";
import { useCart } from "./cart/store";
import { EmptyCartState } from "./cart/EmptyCartState";
import { OrderSummaryCard } from "./cart/OrderSummaryCard";
import type { CartPageViewProps } from "./cart-page-view.types";
import { FooterSection } from "./footer-section";
import { NewsletterSection } from "./newsletter-section";
import { StorefrontHeader } from "./storefront-header";
import { StorefrontThemeProvider } from "./storefront-theme-provider";
import styles from "./storefront.module.css";
import { getLocalizedPath } from "./utils";

export const CartPageView = ({ locale, dictionary }: CartPageViewProps) => {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  const homeHref = getLocalizedPath(locale, "/");
  const shopHref = getLocalizedPath(locale, "/shop");
  const cartHref = getLocalizedPath(locale, "/cart");
  const localizedPaths = Object.fromEntries(
    locales.map((targetLocale) => [
      targetLocale,
      getLocalizedPath(targetLocale, "/cart"),
    ]),
  ) as Record<Locale, string>;

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

  const shipping = subtotal >= 80 || subtotal === 0 ? 0 : 8;
  const discount = 0;

  return (
    <StorefrontThemeProvider>
      <Box className={styles.pageShell} sx={{ color: "text.primary" }}>
        <Box className={styles.pageContent}>
          <StorefrontHeader
            locale={locale}
            dictionary={dictionary}
            localizedPaths={localizedPaths}
            navigationPaths={{
              books: getLocalizedPath(locale, "/shop?category=books"),
              shop: shopHref,
              story: `${homeHref}#story`,
              faq: `${homeHref}#faq`,
              cart: cartHref,
            }}
          />

          <Box sx={{ py: { xs: 4, md: 6 } }}>
            <Container maxWidth="lg">
              <Breadcrumbs sx={{ mb: 4 }}>
                <MuiLink underline="hover" color="inherit" href={homeHref}>
                  {dictionary.cartPage.breadcrumbs.home}
                </MuiLink>
                <MuiLink underline="hover" color="inherit" href={shopHref}>
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

              {items.length === 0 ? (
                <EmptyCartState
                  title={dictionary.cartPage.emptyState.title}
                  text={dictionary.cartPage.emptyState.text}
                  actionLabel={dictionary.cartPage.emptyState.action}
                  actionHref={shopHref}
                />
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

          <NewsletterSection dictionary={dictionary} />
          <FooterSection dictionary={dictionary} />
        </Box>
      </Box>
    </StorefrontThemeProvider>
  );
};