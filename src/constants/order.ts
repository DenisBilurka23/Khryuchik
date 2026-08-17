import type { CustomerOrderStatus } from "@/types/order";

export const customerOrderStatusColors: Record<CustomerOrderStatus, string> = {
  pending: "#FFF3D6",
  confirmed: "#FFF3D6",
  shipped: "#FFF3D6",
  delivered: "#E6F6EC",
  cancelled: "#F8D7DA",
  completed: "#E6F6EC",
  refunded: "#E9E9EF",
};
