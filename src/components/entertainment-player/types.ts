import type { Locale } from "@/i18n/config";

export type PlayerSubtitleTrack = {
  id: string;
  language: string;
  label: string;
  url: string;
};

export type EntertainmentPlayerProps = {
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

export type PlayerSurfaceProps = Omit<EntertainmentPlayerProps, "playLabel">;

export type PlayerAudioTrack = {
  language: string;
  enabled: boolean;
};

export type PlayerAudioTrackList = EventTarget & Iterable<PlayerAudioTrack>;

export type PlayerAudioTrackHost = {
  audioTracks?: PlayerAudioTrackList;
};
