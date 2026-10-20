import type { SxProps, Theme } from "@mui/material";

export type EntertainmentDownloadLinkProps = {
  slug: string;
  label: string;
  variant?: "text" | "contained";
  sx?: SxProps<Theme>;
};
