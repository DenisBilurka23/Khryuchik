import type { PickupPointsStatus } from "@/hooks/usePickupPoints.types";
import type { ShippingPickupPoint } from "@/types/shipping";

import type { CheckoutLabels } from "../../../types";

export type PickupPointSelectProps = {
  points: ShippingPickupPoint[];
  status: PickupPointsStatus;
  selectedPointId?: string;
  onChange: (point: ShippingPickupPoint) => void;
  errorMessage?: string;
  labels: CheckoutLabels;
};
