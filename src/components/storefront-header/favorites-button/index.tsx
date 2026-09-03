"use client";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { IconButton } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";

import type { FavoritesButtonProps } from "./types";

export const FavoritesButton = ({ href, sx }: FavoritesButtonProps) => {
  const t = useTranslations("storefront");
  const label = t("favoritesLabel");

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
        ...sx,
      }}
    >
      <FavoriteBorderIcon />
    </IconButton>
  );
};

export type { FavoritesButtonProps } from "./types";
