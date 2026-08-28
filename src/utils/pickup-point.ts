import type { ShippingPickupPoint } from "@/types/shipping";

export const formatPickupPointAddress = (point: ShippingPickupPoint) =>
  [
    [point.street, point.number].filter(Boolean).join(" "),
    [point.postalCode, point.city].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");
