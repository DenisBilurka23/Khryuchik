import type { CustomerOrderStatus, OrderStatus } from "@/types/order";

export const customerOrderStatusColors: Record<CustomerOrderStatus, string> = {
  pending: "#FFF3D6",
  confirmed: "#FFF3D6",
  shipped: "#FFF3D6",
  delivered: "#E6F6EC",
  cancelled: "#F8D7DA",
  completed: "#E6F6EC",
  refunded: "#E9E9EF",
};

export const orderStatusRank: Record<OrderStatus, number> = {
  new: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: 4,
};
