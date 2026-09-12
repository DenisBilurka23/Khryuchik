import "server-only";

import {
  ENTERTAINMENT_AUDIO_BITRATE_KBPS,
  ENTERTAINMENT_AUDIO_CODEC,
  ENTERTAINMENT_AUDIO_GROUP_ID,
  ENTERTAINMENT_DEFAULT_AUDIO_NAME,
  ENTERTAINMENT_DEFAULT_AUDIO_TRACK_ID,
  ENTERTAINMENT_FRAME_RATE,
  ENTERTAINMENT_SEGMENT_SECONDS,
  ENTERTAINMENT_TRANSCODE_VARIANTS,
} from "@/constants/entertainment";
import { getPublicUploadTarget } from "@/server/storage/r2";
import {
  createEntertainmentSourceDownloadUrl,
  deleteEntertainmentHlsPrefix,
} from "@/server/storage/r2-assets.service";
import type {
  EntertainmentItemDocument,
  EntertainmentTranscodeJob,
  EntertainmentTranscodeQueueItem,
  EntertainmentTranscodeResult,
} from "@/types/entertainment";
import { getEntertainmentHlsPrefix } from "@/utils";

import {
  findEntertainmentItemBySlugForAdmin,
  findEntertainmentItemsAwaitingProcessing,
  updateEntertainmentVideoStatus,
} from "../repositories/entertainment.repository";
import { dispatchEntertainmentTranscode } from "../transcode-dispatch.client";

const getPendingHlsSource = (item: EntertainmentItemDocument | null) => {
  if (!item || item.media.type !== "video") {
    return null;
  }

  const { media } = item;

  if (media.status !== "processing" || media.source?.kind !== "hls") {
    return null;
  }

  return media.source;
};

export const getEntertainmentTranscodeQueue = async (): Promise<
  EntertainmentTranscodeQueueItem[]
> => {
  const items = await findEntertainmentItemsAwaitingProcessing();

  return items
    .filter((item) => getPendingHlsSource(item))
    .map((item) => ({ slug: item.slug, updatedAt: item.updatedAt }));
};

export const getEntertainmentTranscodeJob = async (
  slug: string,
): Promise<EntertainmentTranscodeJob | null> => {
  const item = await findEntertainmentItemBySlugForAdmin(slug);
  const source = getPendingHlsSource(item);

  if (!source) {
    return null;
  }

  const hlsPrefix = getEntertainmentHlsPrefix(source.playlistUrl);

  if (!hlsPrefix) {
    return null;
  }

  const { downloadUrl } = await createEntertainmentSourceDownloadUrl(
    source.sourceObjectKey,
  );

  return {
    slug,
    sourceObjectKey: source.sourceObjectKey,
    sourceUrl: downloadUrl,
    hlsPrefix,
    storage: getPublicUploadTarget(),
    segmentSeconds: ENTERTAINMENT_SEGMENT_SECONDS,
    frameRate: ENTERTAINMENT_FRAME_RATE,
    audioBitrateKbps: ENTERTAINMENT_AUDIO_BITRATE_KBPS,
    audioCodec: ENTERTAINMENT_AUDIO_CODEC,
    audioGroupId: ENTERTAINMENT_AUDIO_GROUP_ID,
    variants: ENTERTAINMENT_TRANSCODE_VARIANTS,
    audioTracks: [
      {
        id: ENTERTAINMENT_DEFAULT_AUDIO_TRACK_ID,
        name: ENTERTAINMENT_DEFAULT_AUDIO_NAME,
        isDefault: true,
      },
    ],
    rebuildVideo: true,
  };
};

export const applyEntertainmentTranscodeResult = async ({
  slug,
  sourceObjectKey,
  status,
  failureReason,
}: EntertainmentTranscodeResult) => {
  const applied = await updateEntertainmentVideoStatus({
    slug,
    sourceObjectKey,
    status,
    failureReason,
  });

  if (!applied || status !== "failed") {
    return applied;
  }

  const item = await findEntertainmentItemBySlugForAdmin(slug);
  const playlistUrl =
    item?.media.type === "video" && item.media.source?.kind === "hls"
      ? item.media.source.playlistUrl
      : null;
  const hlsPrefix = playlistUrl ? getEntertainmentHlsPrefix(playlistUrl) : null;

  if (hlsPrefix) {
    try {
      await deleteEntertainmentHlsPrefix(hlsPrefix);
    } catch (error) {
      console.error("Entertainment ladder cleanup failed", error);
    }
  }

  return applied;
};

export const requeueEntertainmentTranscode = async (slug: string) => {
  const item = await findEntertainmentItemBySlugForAdmin(slug);

  if (
    !item ||
    item.media.type !== "video" ||
    item.media.source?.kind !== "hls"
  ) {
    return false;
  }

  const { source, status } = item.media;

  if (status !== "processing") {
    const moved = await updateEntertainmentVideoStatus({
      slug,
      sourceObjectKey: source.sourceObjectKey,
      status: "processing",
    });

    if (!moved) {
      return false;
    }
  }

  return dispatchEntertainmentTranscode(slug);
};
