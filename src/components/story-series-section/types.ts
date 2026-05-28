import type { StoryPageLabels } from "@/i18n/types";

export type StorySeriesSectionProps = StoryPageLabels["series"] & {
  shopHref: string;
};
