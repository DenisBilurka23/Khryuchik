import type { SxProps, Theme } from "@mui/material";

export const displayFont =
  "var(--font-display, var(--font-display-fallback)), serif";

export const leadSx = {
  fontSize: 16,
  lineHeight: 1.65,
  color: "var(--color-text-secondary)",
} as const satisfies SxProps<Theme>;

export const accentSx = {
  fontStyle: "italic",
  color: "var(--color-accent)",
} as const satisfies SxProps<Theme>;
