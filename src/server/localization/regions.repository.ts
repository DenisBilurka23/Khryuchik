import "server-only";

import { getMongoDb } from "@/server/db/mongodb";
import type { RegionDocument } from "@/types/localization";

export const findAllRegions = async () => {
  const db = await getMongoDb();

  return db
    .collection<RegionDocument>("regions")
    .find({}, { projection: { _id: 0 } })
    .sort({ sortOrder: 1, code: 1 })
    .toArray();
};

export const upsertRegion = async (region: RegionDocument) => {
  const db = await getMongoDb();

  await db.collection<RegionDocument>("regions").replaceOne(
    { code: region.code },
    region,
    { upsert: true },
  );

  return region;
};

export const clearDefaultRegionExcept = async (code: string) => {
  const db = await getMongoDb();

  await db
    .collection<RegionDocument>("regions")
    .updateMany(
      { code: { $ne: code }, isDefault: true },
      { $set: { isDefault: false } },
    );
};

export const deleteRegionByCode = async (code: string) => {
  const db = await getMongoDb();

  return db.collection<RegionDocument>("regions").deleteOne({ code });
};

export const countRegions = async () => {
  const db = await getMongoDb();

  return db.collection<RegionDocument>("regions").countDocuments();
};
