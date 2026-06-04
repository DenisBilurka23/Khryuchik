import type { OrderStatus } from "@/types/order";

export type AdminOrderStatusSelectProps = {
  orderId: string;
  currentStatus: OrderStatus;
};
