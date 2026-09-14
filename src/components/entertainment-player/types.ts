import type { Locale } from "@/i18n/config";

export type PlayerSubtitleTrack = {
  id: string;
  language: string;
  label: string;
  url: string;
};

export type EntertainmentPlayerProps = {
  slug: string;
  playlistUrl: string;
  aspectRatio?: string;
  poster?: string;
  title: string;
  locale: Locale;
  subtitles?: PlayerSubtitleTrack[];
  playLabel: string;
  qualityLabel: string;
  audioLabel: string;
  captionsLabel: string;
  errorTitle: string;
  errorText: string;
};

export type PlayerSurfaceProps = Omit<
  EntertainmentPlayerProps,
  "slug" | "playLabel"
>;
