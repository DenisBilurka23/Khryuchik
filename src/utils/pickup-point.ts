import type {
  ShippingManufacturer,
  ShippingPickupPoint,
} from "@/types/shipping";

export const formatPickupPointAddress = (point: ShippingPickupPoint) =>
  [
    [point.street, point.number].filter(Boolean).join(" "),
    [point.postalCode, point.city].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");

export const formatManufacturerAddress = (manufacturer: ShippingManufacturer) =>
  [
    manufacturer.street,
    [manufacturer.postalCode, manufacturer.city, manufacturer.regionCode]
      .filter(Boolean)
      .join(" "),
    manufacturer.country,
  ]
    .filter(Boolean)
    .join(", ");
