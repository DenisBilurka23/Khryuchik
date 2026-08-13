import { POST } from "@/client-api";
import type { ShippingQuoteRequest, ShippingQuoteResponse } from "@/types/order";

export const quoteShippingClient = async (
  payload: ShippingQuoteRequest,
  options?: Omit<RequestInit, "method" | "body">,
) => POST<ShippingQuoteResponse>("/api/checkout/shipping", payload, options);
