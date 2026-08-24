import type { OrderFulfillment } from "@/types/order";

export type AdminOrderTrackingButtonProps = {
  orderId: string;
  fulfillment: OrderFulfillment;
};
