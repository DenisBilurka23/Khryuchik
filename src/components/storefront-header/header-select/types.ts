import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

export type HeaderSelectOption = {
  value: string;
  label: string;
};

export type HeaderSelectProps = {
  value: string;
  label: string;
  options: HeaderSelectOption[];
  onChange: (value: string) => void;
  icon: ReactNode;
  disabled?: boolean;
  sx?: SxProps<Theme>;
};