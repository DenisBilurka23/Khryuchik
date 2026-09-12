import type { Locale } from "@/i18n/config";

export type EntertainmentPlayerProps = {
  playlistUrl: string;
  aspectRatio?: string;
  poster?: string;
  title: string;
  locale: Locale;
  playLabel: string;
  qualityLabel: string;
  errorTitle: string;
  errorText: string;
};

export type PlayerSurfaceProps = Omit<EntertainmentPlayerProps, "playLabel">;
