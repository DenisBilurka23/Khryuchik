import type {
  EntertainmentCategoryKey,
  EntertainmentTranscodeVariant,
} from "@/types/entertainment";

export const ENTERTAINMENT_CATEGORIES: EntertainmentCategoryKey[] = [
  "cartoons",
  "coloring",
  "games",
  "materials",
];

export const DEFAULT_ENTERTAINMENT_CATEGORY: EntertainmentCategoryKey =
  "cartoons";

export const HOME_ENTERTAINMENT_LIMIT = 4;

export const ENTERTAINMENT_PLACEHOLDER_EMOJI: Record<
  EntertainmentCategoryKey,
  string
> = {
  cartoons: "🎬",
  coloring: "🖍️",
  games: "🧩",
  materials: "📄",
};

export const ENTERTAINMENT_QUERY_PARAM = "entertainment";

export const ENTERTAINMENT_VIDEO_CATEGORIES: EntertainmentCategoryKey[] = [
  "cartoons",
];

export const ENTERTAINMENT_VIDEO_CONTENT_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-matroska",
  "video/webm",
];

export const ENTERTAINMENT_POSTER_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export const ENTERTAINMENT_DOWNLOAD_CONTENT_TYPES = [
  "application/pdf",
  "application/zip",
  "image/jpeg",
  "image/png",
];

export const ENTERTAINMENT_AUDIO_CONTENT_TYPES = [
  "audio/mpeg",
  "audio/mp4",
  "audio/aac",
  "audio/wav",
  "audio/x-wav",
  "audio/flac",
  "audio/ogg",
  "video/mp4",
  "video/quicktime",
  "video/x-matroska",
  "video/webm",
];

export const ENTERTAINMENT_SUBTITLE_CONTENT_TYPES = ["text/vtt"];

export const ENTERTAINMENT_VIDEO_MAX_BYTES = 2 * 1024 * 1024 * 1024;

export const ENTERTAINMENT_AUDIO_MAX_BYTES = 2 * 1024 * 1024 * 1024;

export const ENTERTAINMENT_LANGUAGE_CODE_PATTERN =
  /^[a-z]{2,3}(-[a-z0-9]{2,8})*$/i;

export const ENTERTAINMENT_MAX_AUDIO_TRACKS = 8;

export const ENTERTAINMENT_MAX_SUBTITLE_TRACKS = 8;

export const ENTERTAINMENT_SUBTITLE_MAX_BYTES = 1024 * 1024;

export const ENTERTAINMENT_POSTER_MAX_BYTES = 8 * 1024 * 1024;

export const ENTERTAINMENT_DOWNLOAD_MAX_BYTES = 200 * 1024 * 1024;

export const DEFAULT_ENTERTAINMENT_SORT_ORDER = 100;

export const ENTERTAINMENT_SEGMENT_SECONDS = 6;

export const ENTERTAINMENT_FRAME_RATE = 25;

export const ENTERTAINMENT_TRANSCODE_VARIANTS: EntertainmentTranscodeVariant[] =
  [
    {
      name: "240p",
      shortSide: 240,
      crf: 25,
      maxBitrateKbps: 400,
      profile: "baseline",
      level: "2.0",
      codec: "avc1.42c014",
    },
    {
      name: "360p",
      shortSide: 360,
      crf: 24,
      maxBitrateKbps: 700,
      profile: "baseline",
      level: "3.0",
      codec: "avc1.42c01e",
    },
    {
      name: "480p",
      shortSide: 480,
      crf: 23,
      maxBitrateKbps: 1200,
      profile: "main",
      level: "3.1",
      codec: "avc1.4d401f",
    },
    {
      name: "720p",
      shortSide: 720,
      crf: 22,
      maxBitrateKbps: 2600,
      profile: "main",
      level: "3.2",
      codec: "avc1.4d4020",
    },
    {
      name: "1080p",
      shortSide: 1080,
      crf: 21,
      maxBitrateKbps: 4500,
      profile: "high",
      level: "4.0",
      codec: "avc1.640028",
    },
  ];

export const ENTERTAINMENT_PLAYER_ABR_INITIAL_ESTIMATE = 6_000_000;

export const ENTERTAINMENT_AUDIO_BITRATE_KBPS = 128;

export const ENTERTAINMENT_AUDIO_CODEC = "mp4a.40.2";

export const ENTERTAINMENT_AUDIO_GROUP_ID = "aud";

export const ENTERTAINMENT_DEFAULT_AUDIO_NAME = "Original";

export const ENTERTAINMENT_DEFAULT_AUDIO_TRACK_ID = "default";

export const ENTERTAINMENT_CAPTION_SCALES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const ENTERTAINMENT_CAPTION_SCALE_STORAGE_KEY =
  "khryuchik:caption-scale";

export const ENTERTAINMENT_TRANSCRIBE_MODEL = "whisper-1";

export const ENTERTAINMENT_TRANSCRIBE_SAMPLE_RATE = 16_000;

export const ENTERTAINMENT_TRANSCRIBE_MAX_BYTES = 25 * 1024 * 1024;

export const ENTERTAINMENT_TRANSCRIBE_VOCABULARY = ["Хрючик", "Khryuchik"];

export const ENTERTAINMENT_VIEW_STORAGE_PREFIX = "entertainment-view:";
