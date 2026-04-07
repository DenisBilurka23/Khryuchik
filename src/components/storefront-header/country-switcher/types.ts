import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/utils";
import type { SxProps, Theme } from "@mui/material/styles";

export type CountrySwitcherProps = {
  country: CountryCode;
  locale: Locale;
  label: string;
  sx?: SxProps<Theme>;
};