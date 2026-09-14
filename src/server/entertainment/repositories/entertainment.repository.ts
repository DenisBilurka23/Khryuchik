import "server-only";

import type { Filter } from "mongodb";

import { getMongoDb } from "@/server/db/mongodb";
import type {
  EntertainmentAudioTrack,
  EntertainmentItemDocument,
  EntertainmentSubtitleTrack,
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

export const findHomeEntertainmentItems = async () => {
  const collection = await getEntertainmentCollection();

  return collection
    .find(
      { ...publishedFilter, "status.visibleOnHome": true },
      { projection: { _id: 0 } },
    )
    .sort({ sortOrder: 1 })
    .toArray();
};

export const findPublishedEntertainmentItems = async () => {
  const collection = await getEntertainmentCollection();

  return collection
    .find(publishedFilter, { projection: { _id: 0 } })
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
  subtitleTracks,
}: {
  slug: string;
  sourceObjectKey: string;
  status?: EntertainmentVideoStatus;
  failureReason?: string;
  audioTracks?: EntertainmentAudioTrack[];
  subtitleTracks?: EntertainmentSubtitleTrack[];
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

  if (subtitleTracks) {
    set["media.subtitleTracks"] = subtitleTracks;
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
