"use client";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Badge, IconButton } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { useCart } from "../../cart/store";

import type { CartButtonProps } from "./types";

export const CartButton = ({ href }: CartButtonProps) => {
  const t = useTranslations("storefront");
  const { totalCount } = useCart();
  const label = t("cartLabel");

  return (
    <IconButton
      component={Link}
      href={href}
      aria-label={label}
      sx={{
        flex: "0 0 auto",
        color: "var(--color-text)",
        "&:hover": {
          color: "var(--color-action)",
          bgcolor: "transparent",
        },
      }}
    >
      <Badge badgeContent={totalCount} color="primary">
        <ShoppingBagOutlinedIcon />
      </Badge>
    </IconButton>
  );
};

export type { CartButtonProps } from "./types";
