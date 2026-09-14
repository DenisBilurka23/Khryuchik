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
  ENTERTAINMENT_TRANSCRIBE_MAX_BYTES,
  ENTERTAINMENT_TRANSCRIBE_MODEL,
  ENTERTAINMENT_TRANSCRIBE_SAMPLE_RATE,
  ENTERTAINMENT_TRANSCRIBE_VOCABULARY,
} from "@/constants/entertainment";
import { getPublicUploadTarget } from "@/server/storage/r2";
import {
  buildEntertainmentExtractedAudioKey,
  buildEntertainmentGeneratedSubtitleKey,
  createEntertainmentExtractedAudioUploadUrl,
  createEntertainmentSourceDownloadUrl,
  createEntertainmentSubtitleUploadUrl,
  deleteEntertainmentHlsPrefix,
  deleteEntertainmentSourceObjects,
} from "@/server/storage/r2-assets.service";
import type {
  EntertainmentAudioTrack,
  EntertainmentItemDocument,
  EntertainmentTranscodeAudioTrack,
  EntertainmentTranscodeJob,
  EntertainmentTranscodeQueueItem,
  EntertainmentTranscodeResult,
} from "@/types/entertainment";
import { getEntertainmentHlsPrefix, getLocaleDisplayName } from "@/utils";

import {
  findEntertainmentItemBySlugForAdmin,
  findEntertainmentItemsAwaitingProcessing,
  updateEntertainmentTranscodeState,
} from "../repositories/entertainment.repository";
import { dispatchEntertainmentTranscode } from "../transcode-dispatch.client";

const getHlsSource = (item: EntertainmentItemDocument | null) => {
  if (!item || item.media.type !== "video") {
    return null;
  }

  return item.media.source?.kind === "hls" ? item.media.source : null;
};

export const isEntertainmentItemPending = (
  item: EntertainmentItemDocument | null,
) => {
  const source = getHlsSource(item);

  if (!source || item?.media.type !== "video") {
    return false;
  }

  return (
    item.media.status === "processing" ||
    (source.audioTracks ?? []).some((track) => track.status !== "ready") ||
    (item.media.subtitleTracks ?? []).some(
      (track) => track.status === "processing",
    )
  );
};

const getTrackName = (track: EntertainmentAudioTrack) => {
  try {
    return getLocaleDisplayName(track.language, track.language);
  } catch {
    return track.language;
  }
};

export const getEntertainmentTranscodeQueue = async (): Promise<
  EntertainmentTranscodeQueueItem[]
> => {
  const items = await findEntertainmentItemsAwaitingProcessing();

  return items
    .filter(isEntertainmentItemPending)
    .map((item) => ({ slug: item.slug, updatedAt: item.updatedAt }));
};

export const getEntertainmentTranscodeJob = async (
  slug: string,
): Promise<EntertainmentTranscodeJob | null> => {
  const item = await findEntertainmentItemBySlugForAdmin(slug);
  const source = getHlsSource(item);

  if (
    !source ||
    !item ||
    item.media.type !== "video" ||
    !isEntertainmentItemPending(item)
  ) {
    return null;
  }

  const hlsPrefix = getEntertainmentHlsPrefix(source.playlistUrl);

  if (!hlsPrefix) {
    return null;
  }

  const rebuildVideo = item.media.status !== "ready";
  const { downloadUrl } = await createEntertainmentSourceDownloadUrl(
    source.sourceObjectKey,
  );
  const storedTracks = source.audioTracks ?? [];
  const requestedLanguages = new Set(
    (item.media.subtitleTracks ?? [])
      .filter((track) => track.status === "processing")
      .map((track) => track.language),
  );

  const createSubtitleTarget = async (track: EntertainmentAudioTrack) => {
    if (!track.language || !requestedLanguages.has(track.language)) {
      return {};
    }

    const [upload, audio] = await Promise.all([
      createEntertainmentSubtitleUploadUrl(
        buildEntertainmentGeneratedSubtitleKey({
          hlsPrefix,
          trackId: track.id,
        }),
      ),
      track.sourceObjectKey
        ? createEntertainmentSourceDownloadUrl(track.sourceObjectKey)
        : Promise.resolve({ downloadUrl }),
    ]);

    return {
      subtitleUploadUrl: upload.uploadUrl,
      subtitleAudioUrl: audio.downloadUrl,
    };
  };

  const audioTracks: EntertainmentTranscodeAudioTrack[] =
    storedTracks.length === 0
      ? [
          {
            id: ENTERTAINMENT_DEFAULT_AUDIO_TRACK_ID,
            name: ENTERTAINMENT_DEFAULT_AUDIO_NAME,
            isDefault: true,
            needed: true,
          },
        ]
      : await Promise.all(
          storedTracks.map(async (track) => {
            const needed = track.status !== "ready";
            const base: EntertainmentTranscodeAudioTrack = {
              id: track.id,
              name: getTrackName(track),
              language: track.language,
              isDefault: track.isDefault,
              needed,
            };

            const subtitleTarget = await createSubtitleTarget(track);

            if (!needed || track.isDefault || !track.sourceObjectKey) {
              return { ...base, ...subtitleTarget };
            }

            const [sourceDownload, extractedUpload] = await Promise.all([
              createEntertainmentSourceDownloadUrl(track.sourceObjectKey),
              createEntertainmentExtractedAudioUploadUrl(
                buildEntertainmentExtractedAudioKey({
                  hlsPrefix,
                  trackId: track.id,
                }),
              ),
            ]);

            return {
              ...base,
              ...subtitleTarget,
              sourceUrl: sourceDownload.downloadUrl,
              extractedUploadUrl: extractedUpload.uploadUrl,
            };
          }),
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
    transcribeModel: ENTERTAINMENT_TRANSCRIBE_MODEL,
    transcribeSampleRate: ENTERTAINMENT_TRANSCRIBE_SAMPLE_RATE,
    transcribeMaxBytes: ENTERTAINMENT_TRANSCRIBE_MAX_BYTES,
    transcribePrompt: ENTERTAINMENT_TRANSCRIBE_VOCABULARY.join(", "),
    variants: ENTERTAINMENT_TRANSCODE_VARIANTS,
    audioTracks,
    rebuildVideo,
  };
};

export const applyEntertainmentTranscodeResult = async ({
  slug,
  sourceObjectKey,
  status,
  failureReason,
  tracks = [],
}: EntertainmentTranscodeResult) => {
  const item = await findEntertainmentItemBySlugForAdmin(slug);
  const source = getHlsSource(item);

  if (
    !item ||
    !source ||
    item.media.type !== "video" ||
    source.sourceObjectKey !== sourceObjectKey
  ) {
    return false;
  }

  const hlsPrefix = getEntertainmentHlsPrefix(source.playlistUrl);
  const wasRebuildingVideo = item.media.status !== "ready";
  const resultById = new Map(tracks.map((track) => [track.id, track]));
  const containersToDelete: string[] = [];

  const nextTracks = (source.audioTracks ?? []).map((track) => {
    const result = resultById.get(track.id);

    if (!result) {
      return track;
    }

    if (result.status !== "ready") {
      return {
        ...track,
        status: result.status,
        failureReason: result.failureReason,
      };
    }

    const extractedKey =
      !track.isDefault && hlsPrefix
        ? buildEntertainmentExtractedAudioKey({ hlsPrefix, trackId: track.id })
        : undefined;

    if (
      extractedKey &&
      track.sourceObjectKey &&
      track.sourceObjectKey !== extractedKey
    ) {
      containersToDelete.push(track.sourceObjectKey);
    }

    return {
      id: track.id,
      language: track.language,
      isDefault: track.isDefault,
      status: "ready" as const,
      ...(extractedKey
        ? { sourceObjectKey: extractedKey }
        : track.sourceObjectKey
          ? { sourceObjectKey: track.sourceObjectKey }
          : {}),
    };
  });

  const storedSubtitles = item.media.subtitleTracks ?? [];
  const generatedLanguages = new Set(
    (source.audioTracks ?? [])
      .filter((track) => resultById.get(track.id)?.subtitleGenerated)
      .map((track) => track.language),
  );
  const subtitleFailureByLanguage = new Map(
    (source.audioTracks ?? [])
      .filter((track) => track.language)
      .map((track) => [
        track.language,
        resultById.get(track.id)?.subtitleFailureReason,
      ]),
  );
  const hasPendingSubtitles = storedSubtitles.some(
    (track) => track.status === "processing",
  );
  const nextSubtitles = storedSubtitles.map((track) => {
    if (track.status !== "processing") {
      return track;
    }

    if (generatedLanguages.has(track.language)) {
      return { ...track, status: "ready" as const, failureReason: undefined };
    }

    return {
      ...track,
      status: "failed" as const,
      failureReason: subtitleFailureByLanguage.get(track.language),
    };
  });

  const applied = await updateEntertainmentTranscodeState({
    slug,
    sourceObjectKey,
    status: wasRebuildingVideo ? status : undefined,
    failureReason: wasRebuildingVideo ? failureReason : undefined,
    audioTracks: source.audioTracks ? nextTracks : undefined,
    subtitleTracks: hasPendingSubtitles ? nextSubtitles : undefined,
  });

  if (!applied) {
    return false;
  }

  try {
    if (containersToDelete.length > 0) {
      await deleteEntertainmentSourceObjects(containersToDelete);
    }

    if (wasRebuildingVideo && status === "failed" && hlsPrefix) {
      await deleteEntertainmentHlsPrefix(hlsPrefix);
    }
  } catch (error) {
    console.error("Entertainment transcode cleanup failed", error);
  }

  return true;
};

export const requeueEntertainmentTranscode = async (slug: string) => {
  const item = await findEntertainmentItemBySlugForAdmin(slug);
  const source = getHlsSource(item);

  if (!item || !source || item.media.type !== "video") {
    return false;
  }

  const retriedTracks = source.audioTracks?.map((track) =>
    track.status === "failed"
      ? { ...track, status: "processing" as const, failureReason: undefined }
      : track,
  );
  const needsVideoReset =
    item.media.status !== "ready" && item.media.status !== "processing";

  if (needsVideoReset || retriedTracks) {
    const applied = await updateEntertainmentTranscodeState({
      slug,
      sourceObjectKey: source.sourceObjectKey,
      status: needsVideoReset ? "processing" : undefined,
      audioTracks: retriedTracks,
    });

    if (!applied) {
      return false;
    }
  }

  return dispatchEntertainmentTranscode(slug);
};
