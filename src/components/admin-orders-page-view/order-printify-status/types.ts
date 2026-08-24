import type { OrderFulfillment, OrderPrintifyInfo } from "@/types/order";

export type AdminOrderPrintifyStatusProps = {
  printifyOrder?: OrderPrintifyInfo;
  fulfillments?: OrderFulfillment[];
};
