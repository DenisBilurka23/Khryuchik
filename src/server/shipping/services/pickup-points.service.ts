import "server-only";

import { hasBpostPickupPoints } from "@/constants/bpost";
import type {
  ShippingDestination,
  ShippingPickupPoint,
} from "@/types/shipping";

import {
  getBpostLocatorConfig,
  searchBpostPickupPoints,
} from "../providers/bpost-locator.client";

export const findPickupPoints = async (
  destination: ShippingDestination,
): Promise<ShippingPickupPoint[]> => {
  if (!hasBpostPickupPoints(destination.country)) {
    return [];
  }

  const config = getBpostLocatorConfig();

  if (!config) {
    console.error(
      "BPOST_LOCATOR_PARTNER or BPOST_LOCATOR_APP_ID is not set; cannot list pickup points",
    );

    return [];
  }

  try {
    return await searchBpostPickupPoints(config, destination);
  } catch (error) {
    console.error("bpost pickup point lookup failed", error);

    return [];
  }
};

export const resolvePickupPoint = async (
  destination: ShippingDestination,
  pointId: string,
): Promise<ShippingPickupPoint | null> => {
  const points = await findPickupPoints(destination);

  return points.find((point) => point.id === pointId) ?? null;
};
