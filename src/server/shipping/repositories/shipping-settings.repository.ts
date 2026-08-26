import "server-only";

import { getMongoDb } from "@/server/db/mongodb";
import type { ShippingSettingsDocument } from "@/types/shipping";

const SETTINGS_KEY = "default" as const;

export const findShippingSettings = async () => {
  const db = await getMongoDb();

  return db
    .collection<ShippingSettingsDocument>("shippingSettings")
    .findOne({ key: SETTINGS_KEY }, { projection: { _id: 0 } });
};

export const upsertShippingSettings = async (
  settings: Omit<ShippingSettingsDocument, "key">,
) => {
  const db = await getMongoDb();
  const document: ShippingSettingsDocument = { ...settings, key: SETTINGS_KEY };

  await db
    .collection<ShippingSettingsDocument>("shippingSettings")
    .replaceOne({ key: SETTINGS_KEY }, document, { upsert: true });

  return document;
};
