import type { Locale } from "@/i18n/config";
import type { LocalizedEntertainmentItem } from "@/types/entertainment";

export type EntertainmentMediaLabels = {
  play: string;
  quality: string;
  errorTitle: string;
  errorText: string;
  processingTitle: string;
  processingText: string;
  download: string;
};

export type EntertainmentItemPageViewProps = {
  locale: Locale;
  item: LocalizedEntertainmentItem;
};

export type EntertainmentMediaBlockProps = {
  item: LocalizedEntertainmentItem;
  locale: Locale;
  labels: EntertainmentMediaLabels;
};
