import type { SxProps, Theme } from "@mui/material";
import type { ResponsiveStyleValue } from "@mui/system";

export type LogoMarkProps = {
  alt?: string;
  size?: ResponsiveStyleValue<number | string>;
  radius?: number | string;
  sizes?: string;
  priority?: boolean;
  sx?: SxProps<Theme>;
};

export type LogoProps = {
  title: string;
  subtitle?: string;
  textSx?: SxProps<Theme>;
  markSize?: number;
};
