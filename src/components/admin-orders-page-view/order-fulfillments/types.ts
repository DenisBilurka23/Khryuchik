import type { OrderFulfillment } from "@/types/order";

export type AdminOrderFulfillmentsProps = {
  orderId: string;
  fulfillments?: OrderFulfillment[];
};
