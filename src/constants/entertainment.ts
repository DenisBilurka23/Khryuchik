import type { EntertainmentCategoryKey } from "@/types/entertainment";

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

export const ENTERTAINMENT_VIDEO_MAX_BYTES = 2 * 1024 * 1024 * 1024;

export const ENTERTAINMENT_POSTER_MAX_BYTES = 8 * 1024 * 1024;

export const ENTERTAINMENT_DOWNLOAD_MAX_BYTES = 200 * 1024 * 1024;

export const DEFAULT_ENTERTAINMENT_SORT_ORDER = 100;
