import type { StoryPageLabels } from "@/i18n/types";

export type StoryTimelineSectionProps = StoryPageLabels["timeline"] & {
  shopHref: string;
};
