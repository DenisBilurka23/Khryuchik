import type { BookSeries } from "@/types/catalog";

export const BOOKS_CATEGORY_KEY = "books";

export const DEFAULT_BOOK_STOCK = 10;

export const DEFAULT_BOOK_AGE_RATING = "3+";

export const BOOK_FORMAT = {
  printed: "printed",
  digital: "digital",
} as const;

export const BOOK_SERIES = {
  small: "small",
  travel: "travel",
} as const;

export const BOOK_SERIES_VALUES: readonly BookSeries[] = [
  BOOK_SERIES.small,
  BOOK_SERIES.travel,
];
