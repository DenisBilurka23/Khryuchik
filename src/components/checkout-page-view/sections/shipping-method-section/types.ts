import type { Locale } from "@/i18n/config";
import type { PickupPointsStatus } from "@/hooks/usePickupPoints.types";
import type { ShippingPickupPoint, ShippingQuoteGroup } from "@/types/shipping";
import type { CurrencyCode } from "@/utils";

import type { CheckoutLabels } from "../../types";

export type ShippingMethodSectionProps = {
  groups: ShippingQuoteGroup[];
  isLoading: boolean;
  errorMessage?: string;
  selectedOptionIds: Record<string, string>;
  onOptionChange: (groupId: string, optionId: string) => void;
  pickupPoints: ShippingPickupPoint[];
  pickupPointsStatus: PickupPointsStatus;
  selectedPickupPoints: Record<string, ShippingPickupPoint>;
  onPickupPointChange: (groupId: string, point: ShippingPickupPoint) => void;
  pickupPointErrorMessage?: string;
  currency: CurrencyCode;
  locale: Locale;
  labels: CheckoutLabels;
};
