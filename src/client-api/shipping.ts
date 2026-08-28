import { POST } from "@/client-api";
import type {
  PickupPointsRequest,
  PickupPointsResponse,
  ShippingQuoteRequest,
  ShippingQuoteResponse,
} from "@/types/order";

export const quoteShippingClient = async (
  payload: ShippingQuoteRequest,
  options?: Omit<RequestInit, "method" | "body">,
) => POST<ShippingQuoteResponse>("/api/checkout/shipping", payload, options);

export const fetchPickupPointsClient = async (
  payload: PickupPointsRequest,
  options?: Omit<RequestInit, "method" | "body">,
) =>
  POST<PickupPointsResponse>("/api/checkout/pickup-points", payload, options);
