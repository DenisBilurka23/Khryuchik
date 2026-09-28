"use client";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Badge, IconButton } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { useWishlist } from "@/hooks/useWishlist";
import { isNavItemActive } from "@/utils/active-nav";

import type { FavoritesButtonProps } from "./types";
import { headerIconButtonSx } from "../utils";

export const FavoritesButton = ({ href, sx }: FavoritesButtonProps) => {
  const t = useTranslations("storefront");
  const pathname = usePathname();
  const { ids } = useWishlist();
  const label = t("favoritesLabel");
  const active = isNavItemActive(pathname, href);

  return (
    <IconButton
      component={Link}
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      sx={{ ...headerIconButtonSx(active), ...sx }}
    >
      <Badge badgeContent={ids.length} color="primary">
        <FavoriteBorderIcon />
      </Badge>
    </IconButton>
  );
};

export type { FavoritesButtonProps } from "./types";
