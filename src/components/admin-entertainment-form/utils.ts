import { ENTERTAINMENT_VIDEO_CATEGORIES } from "@/constants/entertainment";
import type {
  EntertainmentCategoryKey,
  EntertainmentMedia,
} from "@/types/entertainment";

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
