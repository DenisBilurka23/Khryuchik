import type { PlayerSubtitleTrack } from "@/components/entertainment-player";
import type { Locale } from "@/i18n/config";
import type {
  EntertainmentSubtitleTrack,
  LocalizedEntertainmentItem,
} from "@/types/entertainment";
import { getLocaleDisplayName, toIsoDuration } from "@/utils";

export const toPlayerSubtitleTracks = (
  tracks: EntertainmentSubtitleTrack[] | undefined,
  displayLocale: Locale,
): PlayerSubtitleTrack[] | undefined =>
  tracks?.length
    ? tracks.map((track) => ({
        id: track.id,
        language: track.language,
        label: getLocaleDisplayName(track.language as Locale, displayLocale),
        url: track.url,
      }))
    : undefined;

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
