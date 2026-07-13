"use client";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Badge, Button } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { useCart } from "../../cart/store";

import type { CartButtonProps } from "./types";

export const CartButton = ({ href, className }: CartButtonProps) => {
  const t = useTranslations("storefront");
  const { totalCount } = useCart();
  const label = t("cartLabel");

  return (
    <Button
      component={Link}
      href={href}
      variant="contained"
      className={className}
      aria-label={label}
      sx={{
        display: "inline-flex",
        flex: "0 0 auto",
        width: 40,
        minWidth: 40,
        height: 40,
        p: 0,
        borderRadius: "999px",
        justifyContent: "center",
      }}
    >
      <Badge badgeContent={totalCount} color="primary">
        <ShoppingBagOutlinedIcon fontSize="small" />
      </Badge>
    </Button>
  );
};

export type { CartButtonProps } from "./types";