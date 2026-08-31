import type { CartItem } from "@/types/cart";

export type UndeliverableGroupProps = {
  title?: string;
  message: string;
  items: CartItem[];
  removeLabel: string;
  // Absent in the buy-now flow, where there is no cart to drop items from.
  onRemove?: () => void;
};
