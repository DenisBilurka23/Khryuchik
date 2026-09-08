"use client";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { CSSObject } from "@mui/material/styles";

import type { PlatePad } from "../types";

const padStyles: Record<PlatePad, CSSObject> = {
  none: {},
  sm: { padding: "22px 20px" },
  md: { padding: "24px 20px" },
  lg: { padding: "24px 20px" },
};

const padStylesUp: Record<PlatePad, CSSObject> = {
  none: {},
  sm: { padding: 26 },
  md: { padding: 28 },
  lg: { padding: 32 },
};

export const Plate = styled(Box, {
  shouldForwardProp: (prop) => prop !== "interactive" && prop !== "pad",
})<{ interactive?: boolean; pad?: PlatePad }>(
  ({ theme, interactive, pad = "md" }) => ({
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-plate)",
    background: "var(--color-card)",
    boxShadow: "none",
    ...padStyles[pad],
    [theme.breakpoints.up("md")]: padStylesUp[pad],
    ...(interactive
      ? {
          transition: "border-color 0.2s ease",
          "&:hover": { borderColor: "var(--color-border-rose)" },
        }
      : {}),
  }),
);
