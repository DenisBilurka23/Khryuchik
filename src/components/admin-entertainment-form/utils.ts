import { ENTERTAINMENT_VIDEO_CATEGORIES } from "@/constants/entertainment";
import type {
  EntertainmentCategoryKey,
  EntertainmentMedia,
} from "@/types/entertainment";

export const getEntertainmentMediaType = (
  category: EntertainmentCategoryKey,
): EntertainmentMedia["type"] =>
  ENTERTAINMENT_VIDEO_CATEGORIES.includes(category) ? "video" : "download";

export const readVideoDurationSeconds = (file: File) =>
  new Promise<number | null>((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");

    const finish = (duration: number | null) => {
      URL.revokeObjectURL(objectUrl);
      resolve(duration);
    };

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      finish(
        Number.isFinite(video.duration) ? Math.round(video.duration) : null,
      );
    };
    video.onerror = () => finish(null);
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
