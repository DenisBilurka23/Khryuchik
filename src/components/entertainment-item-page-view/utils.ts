import type { LocalizedEntertainmentItem } from "@/types/entertainment";
import { toIsoDuration } from "@/utils";

export const buildYoutubeEmbedUrl = (videoId: string) =>
  `https://www.youtube-nocookie.com/embed/${videoId}`;

export const createVideoStructuredData = (item: LocalizedEntertainmentItem) => {
  if (item.media.type !== "video" || item.media.status !== "ready") {
    return null;
  }

  const { source, durationSeconds } = item.media;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: item.title,
    description: item.description,
    thumbnailUrl: item.poster?.src,
    uploadDate: item.uploadedAt,
    duration: durationSeconds ? toIsoDuration(durationSeconds) : undefined,
    contentUrl:
      source?.kind === "hls"
        ? source.playlistUrl
        : source?.kind === "file"
          ? source.url
          : undefined,
    embedUrl:
      source?.kind === "youtube"
        ? buildYoutubeEmbedUrl(source.videoId)
        : undefined,
  };
};
