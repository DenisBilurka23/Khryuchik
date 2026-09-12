import "server-only";

import type { Filter } from "mongodb";

import { getMongoDb } from "@/server/db/mongodb";
import type {
  EntertainmentAudioTrack,
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
      {
        "media.type": "video",
        $or: [
          { "media.status": "processing" },
          { "media.source.audioTracks.status": { $ne: "ready" } },
        ],
      },
      { projection: { _id: 0 } },
    )
    .sort({ updatedAt: 1 })
    .toArray();
};

export const updateEntertainmentTranscodeState = async ({
  slug,
  sourceObjectKey,
  status,
  failureReason,
  audioTracks,
}: {
  slug: string;
  sourceObjectKey: string;
  status?: EntertainmentVideoStatus;
  failureReason?: string;
  audioTracks?: EntertainmentAudioTrack[];
}) => {
  const collection = await getEntertainmentCollection();
  const set: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  const unset: Record<string, ""> = {};

  if (status) {
    set["media.status"] = status;

    if (failureReason) {
      set["media.failureReason"] = failureReason;
    } else {
      unset["media.failureReason"] = "";
    }
  }

  if (audioTracks) {
    set["media.source.audioTracks"] = audioTracks;
  }

  const result = await collection.updateOne(
    { slug, "media.source.sourceObjectKey": sourceObjectKey },
    {
      $set: set,
      ...(Object.keys(unset).length > 0 ? { $unset: unset } : {}),
    },
  );

  return result.matchedCount > 0;
};
