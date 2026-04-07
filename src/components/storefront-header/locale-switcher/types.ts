import type { Locale } from "@/i18n/config";
import type { SxProps, Theme } from "@mui/material/styles";

export type LocaleSwitcherProps = {
  locale: Locale;
  label: string;
  localizedPaths: Record<Locale, string>;
  sx?: SxProps<Theme>;
};