import "server-only";

import type { Filter } from "mongodb";

import { getMongoDb } from "@/server/db/mongodb";
import type {
  EntertainmentCategoryKey,
  EntertainmentItemDocument,
  EntertainmentVideoStatus,
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

export const findAllEntertainmentItems = async () => {
  const collection = await getEntertainmentCollection();

  return collection
    .find({}, { projection: { _id: 0 } })
    .sort({ sortOrder: 1 })
    .toArray();
};

export const findEntertainmentItemBySlugForAdmin = async (slug: string) => {
  const collection = await getEntertainmentCollection();

  return collection.findOne({ slug }, { projection: { _id: 0 } });
};

export const upsertEntertainmentItem = async (
  item: EntertainmentItemDocument,
  currentSlug?: string,
) => {
  const collection = await getEntertainmentCollection();

  await collection.replaceOne({ slug: currentSlug ?? item.slug }, item, {
    upsert: true,
  });

  return item;
};

export const deleteEntertainmentItemBySlug = async (slug: string) => {
  const collection = await getEntertainmentCollection();

  return collection.deleteOne({ slug });
};

export const findEntertainmentItemsAwaitingProcessing = async () => {
  const collection = await getEntertainmentCollection();

  return collection
    .find(
      { "media.type": "video", "media.status": "processing" },
      { projection: { _id: 0 } },
    )
    .sort({ updatedAt: 1 })
    .toArray();
};

export const updateEntertainmentVideoStatus = async ({
  slug,
  sourceObjectKey,
  status,
  failureReason,
}: {
  slug: string;
  sourceObjectKey: string;
  status: EntertainmentVideoStatus;
  failureReason?: string;
}) => {
  const collection = await getEntertainmentCollection();

  const result = await collection.updateOne(
    { slug, "media.source.sourceObjectKey": sourceObjectKey },
    {
      $set: {
        "media.status": status,
        updatedAt: new Date().toISOString(),
        ...(failureReason ? { "media.failureReason": failureReason } : {}),
      },
      ...(failureReason ? {} : { $unset: { "media.failureReason": "" } }),
    },
  );

  return result.matchedCount > 0;
};
