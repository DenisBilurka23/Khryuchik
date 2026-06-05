import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

export type HeaderSelectOption = {
  value: string;
  label: string;
  selectedLabel?: string;
};

export type HeaderSelectProps = {
  value: string;
  label: string;
  options: HeaderSelectOption[];
  onChangeAction: (value: string) => void;
  icon: ReactNode;
  disabled?: boolean;
  sx?: SxProps<Theme>;
};