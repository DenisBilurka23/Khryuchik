import type { SxProps, Theme } from "@mui/material";

import type { Locale } from "@/i18n/config";
import type { LocalizedEntertainmentItem } from "@/types/entertainment";

export type EntertainmentMediaLabels = {
  play: string;
  quality: string;
  audio: string;
  captions: string;
  errorTitle: string;
  errorText: string;
  processingTitle: string;
  processingText: string;
  download: string;
};

export type EntertainmentItemPageSkeletonProps = {
  locale: Locale;
};

export type AdminViewBadgeProps = {
  isAdmin: Promise<boolean>;
  label: string;
  hasDuration: boolean;
};

export type EntertainmentItemPageViewProps = {
  locale: Locale;
  item: LocalizedEntertainmentItem;
  isAdmin: Promise<boolean>;
};

export type EntertainmentMediaBlockProps = {
  item: LocalizedEntertainmentItem;
  locale: Locale;
  labels: EntertainmentMediaLabels;
};

export type EntertainmentDownloadLinkProps = {
  slug: string;
  href: string;
  label: string;
  sx?: SxProps<Theme>;
};
