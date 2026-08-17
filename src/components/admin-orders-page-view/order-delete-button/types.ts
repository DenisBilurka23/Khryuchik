import type { ReactNode } from "react";

export type AdminOrderDeleteButtonProps = {
  orderId: string;
  action: (formData: FormData) => Promise<void> | void;
  disabledReason?: string;
  icon?: ReactNode;
  iconOnly?: boolean;
  size?: "small" | "medium" | "large";
};
