import type { ReactNode } from "react";

export type DeleteCustomerButtonProps = {
  userId: string;
  action: (formData: FormData) => Promise<void>;
  source?: "list" | "edit";
  icon?: ReactNode;
  iconOnly?: boolean;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
};