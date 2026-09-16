import {
  ENTERTAINMENT_LANGUAGE_CODE_PATTERN,
  ENTERTAINMENT_MAX_AUDIO_TRACKS,
  ENTERTAINMENT_MAX_SUBTITLE_TRACKS,
  ENTERTAINMENT_VIDEO_CATEGORIES,
} from "@/constants/entertainment";
import { AdminEntertainmentFormErrorCode } from "@/server/admin/entertainment-form-state";
import type {
  AdminEntertainmentAudioTrackInput,
  AdminEntertainmentSubtitleTrackInput,
  AdminEntertainmentUploadedFile,
} from "@/types/admin";
import type {
  EntertainmentAudioTrack,
  EntertainmentCategoryKey,
  EntertainmentMedia,
  EntertainmentSubtitleTrack,
} from "@/types/entertainment";

import type {
  AdminEntertainmentFormValidationInput,
  AdminEntertainmentVideoMetadata,
} from "./types";

export const getEntertainmentMediaType = (
  category: EntertainmentCategoryKey,
): EntertainmentMedia["type"] =>
  ENTERTAINMENT_VIDEO_CATEGORIES.includes(category) ? "video" : "download";

export const readVideoMetadata = (file: File) =>
  new Promise<AdminEntertainmentVideoMetadata>((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");

    const finish = (metadata: AdminEntertainmentVideoMetadata) => {
      URL.revokeObjectURL(objectUrl);
      resolve(metadata);
    };

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      finish({
        durationSeconds: Number.isFinite(video.duration)
          ? Math.round(video.duration)
          : null,
        width: video.videoWidth || null,
        height: video.videoHeight || null,
      });
    };
    video.onerror = () =>
      finish({ durationSeconds: null, width: null, height: null });
    video.src = objectUrl;
  });

export const getEntertainmentMediaFileName = (media: EntertainmentMedia) => {
  if (media.type === "download") {
    return media.fileName;
  }

  const { source } = media;

  if (!source) {
    return undefined;
  }

  if (source.kind === "hls") {
    return source.sourceObjectKey.split("/").pop();
  }

  return source.objectKey.split("/").pop();
};

export const captureVideoFrame = (
  video: HTMLVideoElement,
  fileName: string,
): Promise<File | null> =>
  new Promise((resolve) => {
    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context || !canvas.width || !canvas.height) {
      resolve(null);

      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) =>
        resolve(
          blob ? new File([blob], fileName, { type: "image/webp" }) : null,
        ),
      "image/webp",
      0.92,
    );
  });

const ERROR_MESSAGE_KEYS: Record<AdminEntertainmentFormErrorCode, string> = {
  [AdminEntertainmentFormErrorCode.TitleRequired]:
    "errorMessages.titleRequired",
  [AdminEntertainmentFormErrorCode.VideoRequired]:
    "errorMessages.videoRequired",
  [AdminEntertainmentFormErrorCode.FileRequired]: "errorMessages.fileRequired",
  [AdminEntertainmentFormErrorCode.StorageUnavailable]:
    "errorMessages.storageUnavailable",
  [AdminEntertainmentFormErrorCode.SaveFailed]: "errorMessages.saveFailed",
  [AdminEntertainmentFormErrorCode.DeleteFailed]: "errorMessages.deleteFailed",
  [AdminEntertainmentFormErrorCode.RequeueFailed]:
    "errorMessages.requeueFailed",
  [AdminEntertainmentFormErrorCode.AudioLanguageRequired]:
    "errorMessages.audioLanguageRequired",
  [AdminEntertainmentFormErrorCode.AudioLanguageInvalid]:
    "errorMessages.audioLanguageInvalid",
  [AdminEntertainmentFormErrorCode.AudioLanguageDuplicate]:
    "errorMessages.audioLanguageDuplicate",
  [AdminEntertainmentFormErrorCode.AudioFileRequired]:
    "errorMessages.audioFileRequired",
  [AdminEntertainmentFormErrorCode.SubtitleLanguageRequired]:
    "errorMessages.subtitleLanguageRequired",
  [AdminEntertainmentFormErrorCode.SubtitleLanguageInvalid]:
    "errorMessages.subtitleLanguageInvalid",
  [AdminEntertainmentFormErrorCode.SubtitleLanguageDuplicate]:
    "errorMessages.subtitleLanguageDuplicate",
  [AdminEntertainmentFormErrorCode.SubtitleFileRequired]:
    "errorMessages.subtitleFileRequired",
  [AdminEntertainmentFormErrorCode.Unexpected]: "errorMessages.unexpected",
};

export const getAdminEntertainmentErrorMessageKey = (errorCode?: string) =>
  errorCode && errorCode in ERROR_MESSAGE_KEYS
    ? ERROR_MESSAGE_KEYS[errorCode as AdminEntertainmentFormErrorCode]
    : undefined;

const parseJsonField = <T>(formData: FormData, key: string, fallback: T): T => {
  const rawValue = formData.get(key);

  if (typeof rawValue !== "string" || !rawValue.trim()) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
};

const getAudioTracksErrorCode = (
  rows: AdminEntertainmentAudioTrackInput[],
  storedTracks: EntertainmentAudioTrack[],
): AdminEntertainmentFormErrorCode | null => {
  if (rows.length === 0) {
    return null;
  }

  if (rows.length > ENTERTAINMENT_MAX_AUDIO_TRACKS) {
    return AdminEntertainmentFormErrorCode.AudioLanguageDuplicate;
  }

  const storedByLanguage = new Map(
    storedTracks.map((track) => [track.language, track]),
  );
  const seen = new Set<string>();

  for (const row of rows) {
    const language = (row.language ?? "").trim().toLowerCase();

    if (!language) {
      return AdminEntertainmentFormErrorCode.AudioLanguageRequired;
    }

    if (!ENTERTAINMENT_LANGUAGE_CODE_PATTERN.test(language)) {
      return AdminEntertainmentFormErrorCode.AudioLanguageInvalid;
    }

    if (seen.has(language)) {
      return AdminEntertainmentFormErrorCode.AudioLanguageDuplicate;
    }

    seen.add(language);

    if (row.isDefault) {
      continue;
    }

    const sourceObjectKey =
      row.uploadedFile?.objectKey ??
      storedByLanguage.get(language)?.sourceObjectKey;

    if (!sourceObjectKey) {
      return AdminEntertainmentFormErrorCode.AudioFileRequired;
    }
  }

  if (rows.filter((row) => row.isDefault).length !== 1) {
    return AdminEntertainmentFormErrorCode.AudioLanguageRequired;
  }

  return null;
};

const getSubtitleTracksErrorCode = (
  rows: AdminEntertainmentSubtitleTrackInput[],
  storedTracks: EntertainmentSubtitleTrack[],
): AdminEntertainmentFormErrorCode | null => {
  if (rows.length === 0) {
    return null;
  }

  if (rows.length > ENTERTAINMENT_MAX_SUBTITLE_TRACKS) {
    return AdminEntertainmentFormErrorCode.SubtitleLanguageDuplicate;
  }

  const storedByLanguage = new Map(
    storedTracks.map((track) => [track.language, track]),
  );
  const seen = new Set<string>();

  for (const row of rows) {
    const language = (row.language ?? "").trim().toLowerCase();

    if (!language) {
      return AdminEntertainmentFormErrorCode.SubtitleLanguageRequired;
    }

    if (!ENTERTAINMENT_LANGUAGE_CODE_PATTERN.test(language)) {
      return AdminEntertainmentFormErrorCode.SubtitleLanguageInvalid;
    }

    if (seen.has(language)) {
      return AdminEntertainmentFormErrorCode.SubtitleLanguageDuplicate;
    }

    seen.add(language);

    const { uploadedFile } = row;

    if (uploadedFile && !uploadedFile.url) {
      return AdminEntertainmentFormErrorCode.StorageUnavailable;
    }

    if (row.generate && !uploadedFile) {
      continue;
    }

    const stored = storedByLanguage.get(language);

    if (
      !(uploadedFile?.objectKey ?? stored?.objectKey) ||
      !(uploadedFile?.url ?? stored?.url)
    ) {
      return AdminEntertainmentFormErrorCode.SubtitleFileRequired;
    }
  }

  return null;
};

export const getAdminEntertainmentFormErrorCode = ({
  formData,
  storedMedia,
}: AdminEntertainmentFormValidationInput): AdminEntertainmentFormErrorCode | null => {
  const mediaType =
    formData.get("mediaType") === "download" ? "download" : "video";
  const uploadedFile = parseJsonField<AdminEntertainmentUploadedFile | null>(
    formData,
    "mediaFileJson",
    null,
  );

  if (mediaType === "download") {
    return uploadedFile || storedMedia.type === "download"
      ? null
      : AdminEntertainmentFormErrorCode.FileRequired;
  }

  const storedVideo = storedMedia.type === "video" ? storedMedia : null;

  if (!uploadedFile && !storedVideo?.source) {
    return AdminEntertainmentFormErrorCode.VideoRequired;
  }

  const storedAudioTracks =
    storedVideo?.source?.kind === "hls"
      ? (storedVideo.source.audioTracks ?? [])
      : [];

  return (
    getAudioTracksErrorCode(
      parseJsonField<AdminEntertainmentAudioTrackInput[]>(
        formData,
        "audioTracksJson",
        [],
      ),
      storedAudioTracks,
    ) ??
    getSubtitleTracksErrorCode(
      parseJsonField<AdminEntertainmentSubtitleTrackInput[]>(
        formData,
        "subtitleTracksJson",
        [],
      ),
      storedVideo?.subtitleTracks ?? [],
    )
  );
};
