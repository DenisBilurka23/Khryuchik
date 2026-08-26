import "server-only";

import type {
  ShippingDestination,
  ShippingLabelRequest,
  ShippingLabelResult,
  ShippingParcel,
  ShippingProviderCode,
  ShippingQuote,
} from "@/types/shipping";

export type ShippingProvider = {
  code: ShippingProviderCode;
  supports?: (destination: ShippingDestination) => boolean;
  quote: (
    parcel: ShippingParcel,
    destination: ShippingDestination,
  ) => Promise<ShippingQuote>;
  buyLabel?: (request: ShippingLabelRequest) => Promise<ShippingLabelResult>;
};
