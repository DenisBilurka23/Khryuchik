"use client";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { IconButton } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import { getLocalizedPath } from "@/utils";
import { isNavItemActive } from "@/utils/active-nav";

import type { UserButtonProps } from "./types";
import { headerIconButtonSx } from "../utils";

export const UserButton = ({ locale, sx }: UserButtonProps) => {
  const t = useTranslations("storefront");
  const pathname = usePathname();
  const { data: session } = useSession();
  const href = session
    ? getLocalizedPath(locale, "/account")
    : getLocalizedPath(locale, "/login");
  const label = session ? t("userMenu.account") : t("userMenu.signIn");
  const active = isNavItemActive(pathname, href);

  return (
    <IconButton
      component={Link}
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      sx={{ ...headerIconButtonSx(active), ...sx }}
    >
      <PersonOutlineIcon />
    </IconButton>
  );
};

export type { UserButtonProps } from "./types";
