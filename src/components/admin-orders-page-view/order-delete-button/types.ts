import type { ReactNode } from "react";

import type { OrderDeleteBlocker } from "@/types/order";

export type AdminOrderDeleteButtonProps = {
  orderId: string;
  action: (formData: FormData) => Promise<void> | void;
  blocker?: OrderDeleteBlocker;
  icon?: ReactNode;
  iconOnly?: boolean;
  size?: "small" | "medium" | "large";
};
