import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";
import type { StoryTimelineBook } from "@/types/story";

export type StoryPageViewProps = {
  locale: Locale;
  timelineBooks: StoryTimelineBook[];
};

export type StoryPageDictionary = StorefrontDictionary["storyPage"];
