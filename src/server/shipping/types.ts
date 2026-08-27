import "server-only";

import type {
  ShippingDestination,
  ShippingLabelRequest,
  ShippingLabelResult,
  ShippingParcel,
  ShippingProgress,
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
  readProgress?: (externalId: string) => Promise<ShippingProgress>;
};
