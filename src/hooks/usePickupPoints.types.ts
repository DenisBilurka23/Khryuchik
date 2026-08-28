import type { ShippingQuoteRequest } from "@/types/order";
import type { ShippingPickupPoint } from "@/types/shipping";

export type PickupPointsStatus = "idle" | "loading" | "ok" | "empty";

export type UsePickupPointsParams = {
  address: ShippingQuoteRequest["address"] | null;
  isEnabled: boolean;
};

export type UsePickupPointsResult = {
  status: PickupPointsStatus;
  points: ShippingPickupPoint[];
};
