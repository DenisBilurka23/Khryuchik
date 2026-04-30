import type { ButtonProps } from "@mui/material";
import type { ReactNode } from "react";

export type ModalButtonProps = {
  label: string;
  dialogTitle: string;
  dialogDescription: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirmAction: () => void | boolean | Promise<void | boolean>;
  color?: ButtonProps["color"];
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  disabled?: boolean;
  icon?: ReactNode;
  iconOnly?: boolean;
  tooltip?: string;
  ariaLabel?: string;
};