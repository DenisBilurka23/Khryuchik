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
