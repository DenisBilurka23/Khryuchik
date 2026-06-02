"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { clearCart } from "@/components/cart/store";
import storefrontStyles from "@/components/storefront/storefront.module.css";
import type { CheckoutResultLabels } from "@/i18n/types";
import { formatOrderNumber, getLocalizedPath } from "@/utils";

import type { CheckoutResultViewProps } from "./types";

export const CheckoutResultView = ({
  locale,
  kind,
  orderId,
  paymentMethod,
}: CheckoutResultViewProps) => {
  const t = useTranslations("storefront.checkoutResult");
  const success = t.raw("success") as CheckoutResultLabels["success"];
  const cancel = t.raw("cancel") as CheckoutResultLabels["cancel"];
  const confirmation = t.raw(
    "confirmation",
  ) as CheckoutResultLabels["confirmation"];

  useEffect(() => {
    if (kind === "success" || kind === "confirmation") {
      clearCart();
    }
  }, [kind]);

  const shopHref = getLocalizedPath(locale, "/shop");
  const cartHref = getLocalizedPath(locale, "/cart");

  const orderNumber = formatOrderNumber(orderId);

  let title = "";
  let text = "";
  let primary: { label: string; href: string } | null = null;
  let orderLabel: string | null = null;

  if (kind === "success") {
    title = success.title;
    text = success.text;
    primary = { label: success.backToShop, href: shopHref };
    orderLabel = orderNumber ? `${success.orderLabel} ${orderNumber}` : null;
  } else if (kind === "cancel") {
    title = cancel.title;
    text = cancel.text;
    primary = { label: cancel.backToCart, href: cartHref };
  } else {
    title = confirmation.title;
    text =
      paymentMethod === "telegram_transfer"
        ? confirmation.telegramText
        : confirmation.codText;
    orderLabel = orderNumber ? `${confirmation.orderLabel} ${orderNumber}` : null;
    primary = { label: confirmation.backToShop, href: shopHref };
  }

  return (
    <Box className={storefrontStyles.pageShell} sx={{ color: "text.primary" }}>
      <Box className={storefrontStyles.pageContent}>
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Container maxWidth="sm">
            <Card sx={{ border: "1px solid #F0DFC8" }}>
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Stack spacing={3} alignItems="flex-start">
                  <Typography variant="h1" sx={{ fontSize: { xs: 32, md: 44 } }}>
                    {title}
                  </Typography>
                  {orderLabel ? (
                    <Typography
                      sx={{
                        textTransform: "uppercase",
                        letterSpacing: "0.18em",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "primary.main",
                      }}
                    >
                      {orderLabel}
                    </Typography>
                  ) : null}
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {text}
                  </Typography>
                  {primary ? (
                    <Link
                      href={primary.href}
                      style={{ textDecoration: "none" }}
                    >
                      <Button component="span" variant="contained" size="large">
                        {primary.label}
                      </Button>
                    </Link>
                  ) : null}
                </Stack>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export type { CheckoutResultViewProps } from "./types";
