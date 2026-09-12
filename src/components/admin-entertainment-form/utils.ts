import { ENTERTAINMENT_VIDEO_CATEGORIES } from "@/constants/entertainment";
import type {
  EntertainmentCategoryKey,
  EntertainmentMedia,
} from "@/types/entertainment";

import type { Locale } from "@/i18n/config";
import { getLocaleDisplayName } from "@/utils";

import type { AdminEntertainmentVideoMetadata } from "./types";

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

  if (source.kind === "file") {
    return source.objectKey.split("/").pop();
  }

  return source.videoId;
};

export const getAudioTrackLanguageLabel = (
  code: string,
  displayLocale: Locale,
) => {
  const normalized = code.trim();

  if (!normalized) {
    return undefined;
  }

  try {
    return getLocaleDisplayName(normalized, displayLocale);
  } catch {
    return undefined;
  }
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
