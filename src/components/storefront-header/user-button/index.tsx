"use client";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { IconButton } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import { getLocalizedPath } from "@/utils";

import type { UserButtonProps } from "./types";

export const UserButton = ({ locale, sx }: UserButtonProps) => {
  const t = useTranslations("storefront");
  const { data: session } = useSession();
  const href = session
    ? getLocalizedPath(locale, "/account")
    : getLocalizedPath(locale, "/login");
  const label = session ? t("userMenu.account") : t("userMenu.signIn");

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
      <PersonOutlineIcon />
    </IconButton>
  );
};

export type { UserButtonProps } from "./types";
