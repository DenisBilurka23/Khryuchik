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

export type EntertainmentAudioTrackStatus = "processing" | "ready" | "failed";

export type EntertainmentAudioTrack = {
  id: string;
  language: string;
  isDefault: boolean;
  status: EntertainmentAudioTrackStatus;
  sourceObjectKey?: string;
  failureReason?: string;
};

export type EntertainmentSubtitleSource = "manual" | "generated";

export type EntertainmentSubtitleTrackStatus =
  | "processing"
  | "ready"
  | "failed";

export type EntertainmentSubtitleTrack = {
  id: string;
  language: string;
  objectKey: string;
  url: string;
  source: EntertainmentSubtitleSource;
  isPublished: boolean;
  status?: EntertainmentSubtitleTrackStatus;
  failureReason?: string;
};

export type EntertainmentVideoSource =
  | {
      kind: "hls";
      playlistUrl: string;
      sourceObjectKey: string;
      audioTracks?: EntertainmentAudioTrack[];
    }
  | { kind: "file"; url: string; objectKey: string }
  | { kind: "youtube"; videoId: string };

export type EntertainmentVideoMedia = {
  type: "video";
  source: EntertainmentVideoSource | null;
  subtitleTracks?: EntertainmentSubtitleTrack[];
  status: EntertainmentVideoStatus;
  durationSeconds: number | null;
  width?: number;
  height?: number;
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

export type EntertainmentCategoryView = {
  availableCategories: EntertainmentCategoryKey[];
  selectedCategory: EntertainmentCategoryKey | null;
  items: LocalizedEntertainmentItem[];
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
  shortSide: number;
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
  needed: boolean;
  sourceUrl?: string;
  extractedUploadUrl?: string;
  subtitleUploadUrl?: string;
  subtitleAudioUrl?: string;
};

export type EntertainmentTranscodeTrackResult = {
  id: string;
  status: EntertainmentAudioTrackStatus;
  failureReason?: string;
  subtitleGenerated?: boolean;
  subtitleFailureReason?: string;
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
  transcribeModel: string;
  transcribeSampleRate: number;
  transcribeMaxBytes: number;
  transcribePrompt: string;
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
  tracks?: EntertainmentTranscodeTrackResult[];
};
