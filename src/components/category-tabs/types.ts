import type { SxProps, Theme } from "@mui/material";

export type CategoryTabVariant = "pills" | "text";

export type CategoryTabOption = {
  value: string;
  label: string;
};

export type CategoryTabsProps = {
  selectedValue: string;
  options: CategoryTabOption[];
  sx?: SxProps<Theme>;
  queryParamName?: string;
  defaultValueWithoutQuery?: string;
  preserveQueryParams?: string[];
  variant?: CategoryTabVariant;
  label?: string;
};
