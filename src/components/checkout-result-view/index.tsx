"use client";

import { Button, Stack } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { clearCart } from "@/components/cart/store";
import { NoticePage } from "@/components/notice-page";
import type { CheckoutResultLabels } from "@/i18n/types";
import { formatOrderNumber, getLocalizedPath } from "@/utils";

import type { CheckoutResultViewProps } from "./types";

export const CheckoutResultView = ({
  locale,
  kind,
  orderId,
  paymentMethod,
  downloadsHref,
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
    orderLabel = orderNumber
      ? `${confirmation.orderLabel} ${orderNumber}`
      : null;
    primary = { label: confirmation.backToShop, href: shopHref };
  }

  return (
    <NoticePage title={title} label={orderLabel} text={text}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        {downloadsHref ? (
          <Link href={downloadsHref}>
            <Button component="span" variant="contained" size="large">
              {success.downloadsAction}
            </Button>
          </Link>
        ) : null}
        {primary ? (
          <Link href={primary.href}>
            <Button
              component="span"
              variant={downloadsHref ? "outlined" : "contained"}
              size="large"
            >
              {primary.label}
            </Button>
          </Link>
        ) : null}
      </Stack>
    </NoticePage>
  );
};

export type { CheckoutResultViewProps } from "./types";
