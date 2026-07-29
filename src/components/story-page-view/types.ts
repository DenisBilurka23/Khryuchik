import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";

export type StoryPageViewProps = {
  locale: Locale;
};

export type StoryPageDictionary = StorefrontDictionary["storyPage"];
