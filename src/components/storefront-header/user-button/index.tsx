"use client";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Button } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { getLocalizedPath } from "@/utils";

import type { UserButtonProps } from "./types";

export const UserButton = ({
  locale,
  accountLabel,
  signInLabel,
  sx,
}: UserButtonProps) => {
  const { data: session } = useSession();
  const href = session
    ? getLocalizedPath(locale, "/account")
    : getLocalizedPath(locale, "/login");
  const label = session ? accountLabel : signInLabel;

  return (
    <Button
      component={Link}
      href={href}
      variant="outlined"
      color="inherit"
      aria-label={label}
      sx={{
        flex: "0 0 auto",
        minWidth: 40,
        width: 40,
        height: 40,
        p: 0,
        borderRadius: "999px",
        borderColor: "#E8D6BF",
        bgcolor: "#fff",
        ...sx,
      }}
    >
      <PersonOutlineIcon fontSize="small" />
    </Button>
  );
};

export type { UserButtonProps } from "./types";