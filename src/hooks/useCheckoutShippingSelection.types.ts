import type { ShippingPickupPoint, ShippingQuoteGroup } from "@/types/shipping";

export type UseCheckoutShippingSelectionParams = {
  groups: ShippingQuoteGroup[];
  pickupPointRequiredMessage: string;
};

export type UseCheckoutShippingSelectionResult = {
  selectedOptionIds: Record<string, string>;
  selectedPickupPoints: Record<string, ShippingPickupPoint>;
  pickupGroupIds: string[];
  pickupPointError: string | null;
  selectOption: (groupId: string, optionId: string) => void;
  selectPickupPoint: (groupId: string, point: ShippingPickupPoint) => void;
  validatePickupPoints: () => boolean;
  resolvePickupPointIds: () => Record<string, string> | undefined;
};
