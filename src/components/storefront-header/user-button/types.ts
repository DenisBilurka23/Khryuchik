import type { SxProps, Theme } from "@mui/material";

import type { Locale } from "@/i18n/config";

export type UserButtonProps = {
  locale: Locale;
  accountLabel: string;
  signInLabel: string;
  sx?: SxProps<Theme>;
};