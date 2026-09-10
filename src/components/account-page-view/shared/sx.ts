import type { SxProps, Theme } from "@mui/material";

export const accountOrderTotalSx = {
  px: 1.5,
  fontWeight: 800,
} as const satisfies SxProps<Theme>;

export const accountBadgeSx = {
  borderRadius: "var(--radius-button)",
} as const satisfies SxProps<Theme>;
