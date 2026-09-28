import { getRegionPaymentMethods } from "@/utils";
import type { RegionCode } from "@/utils";

export type DeliveryPaymentVariant = "stripe" | "receipt";

export const getDeliveryPaymentVariant = (
  region: RegionCode,
): DeliveryPaymentVariant =>
  getRegionPaymentMethods(region).includes("stripe") ? "stripe" : "receipt";
