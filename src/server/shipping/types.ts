import "server-only";

import type {
  ShippingDestination,
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
};
