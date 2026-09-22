"use client";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Badge, IconButton } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { useCart } from "@/stores/cart";
import { isNavItemActive } from "@/utils/active-nav";

import type { CartButtonProps } from "./types";
import { headerIconButtonSx } from "../utils";

export const CartButton = ({ href }: CartButtonProps) => {
  const t = useTranslations("storefront");
  const pathname = usePathname();
  const { totalCount } = useCart();
  const label = t("cartLabel");
  const active = isNavItemActive(pathname, href);

  return (
    <IconButton
      component={Link}
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      sx={headerIconButtonSx(active)}
    >
      <Badge badgeContent={totalCount} color="primary">
        <ShoppingBagOutlinedIcon />
      </Badge>
    </IconButton>
  );
};

export type { CartButtonProps } from "./types";
