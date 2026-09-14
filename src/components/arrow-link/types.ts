import type { SxProps, Theme } from "@mui/material";

export type ArrowLinkSize = "sm" | "md";

export type ArrowLinkProps = {
  href: string;
  label: string;
  size?: ArrowLinkSize;
  onClick?: () => void;
  sx?: SxProps<Theme>;
};
