"use client";

import { Alert, Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { HeroPanel } from "@/components/primitives";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { useResolvedCart } from "@/hooks/useResolvedCart";
import { getLocalizedPath, isPurchasableAvailability } from "@/utils";

import { CartItemCard, EmptyCartState, OrderSummaryCard } from "../cart";
import { PageShell } from "../storefront/page-shell";
import type { CartPageViewProps } from "./types";

export const CartPageView = ({
  locale,
  country,
  currency,
  isShopClosed = false,
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
  const hasUnavailableItems = items.some(
    (item) => !isPurchasableAvailability(item.availability),
  );

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
    <PageShell>
      <Box component="section">
        <Container maxWidth="lg">
          <Breadcrumbs
            items={[
              { label: cartPage.breadcrumbs.home, href: homeHref },
              { label: cartPage.breadcrumbs.shop, href: shopHref },
              { label: cartPage.breadcrumbs.current },
            ]}
          />

          <HeroPanel sx={{ p: { xs: "28px 20px", md: 5 } }}>
            <SectionEyebrow label={cartPage.eyebrow} />

            <Typography
              variant="h1"
              sx={{ mt: 2.5, fontSize: "clamp(32px, 3.6vw, 48px)" }}
            >
              {cartPage.title}
            </Typography>

            <Typography
              sx={{
                maxWidth: "62ch",
                mt: 2.25,
                fontSize: { xs: 16, md: 17 },
                lineHeight: 1.65,
                color: "var(--color-text)",
              }}
            >
              {cartPage.lead}
            </Typography>
          </HeroPanel>

          {isPricingUnavailable ? (
            <Alert
              severity="warning"
              sx={{ mt: 3, borderRadius: "var(--radius-field)" }}
            >
              {cartPage.pricingUnavailable}
            </Alert>
          ) : null}

          {!hasStoredItems && !isLoading ? (
            <Box sx={{ mt: 4 }}>
              <EmptyCartState
                title={cartPage.emptyState.title}
                text={cartPage.emptyState.text}
                actionLabel={cartPage.emptyState.action}
                actionHref={shopHref}
              />
            </Box>
          ) : isLoading ? (
            <Box
              sx={{
                mt: 4,
                p: 4,
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-panel)",
                fontSize: 15,
                color: "var(--color-text-secondary)",
                background: "var(--color-card)",
              }}
            >
              <Typography color="text.secondary">Loading cart...</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  lg: "minmax(0, 1fr) 380px",
                },
                alignItems: "flex-start",
                gap: 3,
                mt: 4,
              }}
            >
              <Box sx={{ display: "grid", gap: 2 }}>
                {items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    locale={locale}
                    variantLabel={cartPage.itemCard.variantLabel}
                    removeLabel={cartPage.itemCard.removeLabel}
                    soldOutLabel={cartPage.itemCard.soldOut}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={handleRemove}
                  />
                ))}
              </Box>

              <Box sx={{ position: { lg: "sticky" }, top: { lg: 100 } }}>
                <OrderSummaryCard
                  locale={locale}
                  currency={currency}
                  subtotal={subtotal}
                  discount={discount}
                  isDigitalOnly={isDigitalOnly}
                  continueShoppingHref={shopHref}
                  checkoutHref={checkoutHref}
                  isShopClosed={isShopClosed}
                  hasUnavailableItems={hasUnavailableItems}
                />
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </PageShell>
  );
};

export type { CartPageViewProps } from "./types";
