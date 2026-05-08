import type { ReactNode } from "react";

export type DeleteCustomerButtonProps = {
  userId: string;
  action: (formData: FormData) => Promise<void>;
  label: string;
  dialogTitle: string;
  dialogDescription: string;
  confirmLabel: string;
  cancelLabel: string;
  source?: "list" | "edit";
  tooltip?: string;
  ariaLabel?: string;
  icon?: ReactNode;
  iconOnly?: boolean;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
};