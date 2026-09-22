"use client";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { IconButton } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { isNavItemActive } from "@/utils/active-nav";

import type { FavoritesButtonProps } from "./types";
import { headerIconButtonSx } from "../utils";

export const FavoritesButton = ({ href, sx }: FavoritesButtonProps) => {
  const t = useTranslations("storefront");
  const pathname = usePathname();
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
      <FavoriteBorderIcon />
    </IconButton>
  );
};

export type { FavoritesButtonProps } from "./types";
