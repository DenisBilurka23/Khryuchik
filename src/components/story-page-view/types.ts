import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";
import type { BookSeries } from "@/types/catalog";
import type { StoryTimelineBook } from "@/types/story";

export type StoryPageViewProps = {
  locale: Locale;
  timelineBooks: Promise<StoryTimelineBook[]>;
  seriesCounts: Promise<Record<BookSeries, number>>;
};

export type StoryPageSkeletonProps = {
  locale: Locale;
};

export type StoryPageDictionary = StorefrontDictionary["storyPage"];
