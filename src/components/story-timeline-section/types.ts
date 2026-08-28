import type { StoryPageLabels } from "@/i18n/types";
import type { StoryTimelineBook } from "@/types/story";

export type StoryTimelineSectionProps = StoryPageLabels["timeline"] & {
  books: StoryTimelineBook[];
};
