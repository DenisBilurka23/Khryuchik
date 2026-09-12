import type { Locale } from "@/i18n/config";

import type { ProductImage } from "./product-details";

export type EntertainmentCategoryKey =
  | "cartoons"
  | "coloring"
  | "games"
  | "materials";

export type EntertainmentVideoStatus =
  | "uploading"
  | "processing"
  | "ready"
  | "failed";

export type EntertainmentVideoSource =
  | { kind: "hls"; playlistUrl: string; sourceObjectKey: string }
  | { kind: "file"; url: string; objectKey: string }
  | { kind: "youtube"; videoId: string };

export type EntertainmentVideoMedia = {
  type: "video";
  source: EntertainmentVideoSource | null;
  status: EntertainmentVideoStatus;
  durationSeconds: number | null;
  failureReason?: string;
};

export type EntertainmentDownloadMedia = {
  type: "download";
  fileName: string;
  objectKey: string;
  url: string;
  contentType: string;
  sizeBytes: number;
};

export type EntertainmentMedia =
  | EntertainmentVideoMedia
  | EntertainmentDownloadMedia;

export type EntertainmentTranslation = {
  title: string;
  description?: string;
  poster?: ProductImage;
};

export type EntertainmentStatus = {
  isActive: boolean;
  visibleOnHome: boolean;
};

export type EntertainmentItemDocument = {
  slug: string;
  category: EntertainmentCategoryKey;
  media: EntertainmentMedia;
  status: EntertainmentStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  translations: Partial<Record<Locale, EntertainmentTranslation>>;
};

export type LocalizedEntertainmentItem = {
  slug: string;
  category: EntertainmentCategoryKey;
  title: string;
  description?: string;
  poster?: ProductImage;
  media: EntertainmentMedia;
  sortOrder: number;
  uploadedAt: string;
};

export type EntertainmentTranscodeVariant = {
  name: string;
  height: number;
  crf: number;
  maxBitrateKbps: number;
  profile: string;
  level: string;
  codec: string;
};

export type EntertainmentTranscodeAudioTrack = {
  id: string;
  name: string;
  language?: string;
  isDefault: boolean;
  sourceUrl?: string;
};

export type EntertainmentTranscodeStorageTarget = {
  endpoint: string;
  bucket: string;
};

export type EntertainmentTranscodeJob = {
  slug: string;
  sourceObjectKey: string;
  sourceUrl: string;
  hlsPrefix: string;
  storage: EntertainmentTranscodeStorageTarget;
  segmentSeconds: number;
  frameRate: number;
  audioBitrateKbps: number;
  audioCodec: string;
  audioGroupId: string;
  variants: EntertainmentTranscodeVariant[];
  audioTracks: EntertainmentTranscodeAudioTrack[];
  rebuildVideo: boolean;
};

export type EntertainmentTranscodeQueueItem = {
  slug: string;
  updatedAt: string;
};

export type EntertainmentTranscodeOutcome = "ready" | "failed";

export type EntertainmentTranscodeResult = {
  slug: string;
  sourceObjectKey: string;
  status: EntertainmentTranscodeOutcome;
  failureReason?: string;
};
