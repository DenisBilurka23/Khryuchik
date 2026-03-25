import type { SxProps, Theme } from "@mui/material";

export type CategoryTabOption = {
  value: string;
  label: string;
};

export type CategoryTabsProps = {
  selectedValue: string;
  options: CategoryTabOption[];
  className?: string;
  queryParamName?: string;
  defaultValueWithoutQuery?: string;
  preserveQueryParams?: string[];
  sx?: SxProps<Theme>;
};