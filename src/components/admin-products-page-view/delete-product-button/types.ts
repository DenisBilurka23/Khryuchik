import type { ReactNode } from "react";

export type DeleteProductButtonProps = {
  productId: string;
  action: (formData: FormData) => Promise<void>;
  label: string;
  dialogTitle: string;
  dialogDescription: string;
  confirmLabel: string;
  cancelLabel: string;
  tooltip?: string;
  ariaLabel?: string;
  icon?: ReactNode;
  iconOnly?: boolean;
  size?: "small" | "medium" | "large";
};