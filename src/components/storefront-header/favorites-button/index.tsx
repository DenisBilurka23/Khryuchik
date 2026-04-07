"use client";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Button } from "@mui/material";
import Link from "next/link";

import type { FavoritesButtonProps } from "./types";

export const FavoritesButton = ({ href, label }: FavoritesButtonProps) => {
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
      }}
    >
      <FavoriteBorderIcon fontSize="small" />
    </Button>
  );
};

export type { FavoritesButtonProps } from "./types";