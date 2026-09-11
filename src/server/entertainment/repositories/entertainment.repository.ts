import "server-only";

import type { Filter } from "mongodb";

import { getMongoDb } from "@/server/db/mongodb";
import type {
  EntertainmentCategoryKey,
  EntertainmentItemDocument,
} from "@/types/entertainment";

const COLLECTION_NAME = "entertainment";

const getEntertainmentCollection = async () => {
  const db = await getMongoDb();

  return db.collection<EntertainmentItemDocument>(COLLECTION_NAME);
};

const publishedFilter: Filter<EntertainmentItemDocument> = {
  "status.isActive": true,
  $or: [{ "media.type": "download" }, { "media.status": "ready" }],
};

export const findHomeEntertainmentItems = async (
  limit: number,
  category?: EntertainmentCategoryKey,
) => {
  const collection = await getEntertainmentCollection();
  const homeFilter = { ...publishedFilter, "status.visibleOnHome": true };

  return collection
    .find(category ? { ...homeFilter, category } : homeFilter, {
      projection: { _id: 0 },
    })
    .sort({ sortOrder: 1 })
    .limit(limit)
    .toArray();
};

export const findPublishedEntertainmentItems = async (
  category?: EntertainmentCategoryKey,
) => {
  const collection = await getEntertainmentCollection();

  return collection
    .find(category ? { ...publishedFilter, category } : publishedFilter, {
      projection: { _id: 0 },
    })
    .sort({ sortOrder: 1 })
    .toArray();
};

export const findEntertainmentItemBySlug = async (slug: string) => {
  const collection = await getEntertainmentCollection();

  return collection.findOne(
    { ...publishedFilter, slug },
    { projection: { _id: 0 } },
  );
};
