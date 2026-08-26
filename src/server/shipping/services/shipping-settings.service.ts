import "server-only";

import { cache } from "react";

import type {
  ShippingManufacturer,
  ShippingSettingsDocument,
} from "@/types/shipping";

import {
  findShippingSettings,
  upsertShippingSettings,
} from "../repositories/shipping-settings.repository";

export const getShippingSettings = cache(
  async (): Promise<ShippingSettingsDocument | null> => findShippingSettings(),
);

export const getShippingManufacturer = async (): Promise<
  ShippingManufacturer | undefined
> => (await getShippingSettings())?.manufacturer;

export const saveShippingSettings = async (
  manufacturer: ShippingManufacturer | undefined,
) => upsertShippingSettings({ manufacturer });
