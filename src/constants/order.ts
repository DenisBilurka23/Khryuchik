import type { CustomerOrderStatus, OrderStatus } from "@/types/order";

export const customerOrderStatusColors: Record<CustomerOrderStatus, string> = {
  pending: "var(--color-butter)",
  confirmed: "var(--color-butter)",
  shipped: "var(--color-butter)",
  delivered: "var(--color-green-light)",
  cancelled: "var(--color-accent-tint)",
  completed: "var(--color-green-light)",
  refunded: "var(--color-products)",
};

export const orderStatusRank: Record<OrderStatus, number> = {
  new: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: 4,
};
