import type { ShippingQuoteRequest } from "@/types/order";
import type { ShippingPickupPoint } from "@/types/shipping";

export type AdminOrderPickupPointButtonProps = {
  orderId: string;
  fulfillmentId: string;
  address: ShippingQuoteRequest["address"];
  pickupPoint?: ShippingPickupPoint;
};
