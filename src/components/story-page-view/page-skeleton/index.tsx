import { getTranslations } from "next-intl/server";

import { PageShell } from "@/components/page-shell";
import { StoryValuesSection } from "@/components/story-values-section";

import { StorySectionSkeleton } from "../skeleton";
import type { StoryPageDictionary, StoryPageSkeletonProps } from "../types";

export const StoryPageSkeleton = async ({ locale }: StoryPageSkeletonProps) => {
  const t = await getTranslations({
    locale,
    namespace: "storefront.storyPage",
  });
  const series = t.raw("series") as StoryPageDictionary["series"];
  const values = t.raw("values") as StoryPageDictionary["values"];
  const timeline = t.raw("timeline") as StoryPageDictionary["timeline"];

  return (
    <PageShell>
      <StorySectionSkeleton
        kind="series"
        eyebrow={series.eyebrow}
        title={series.title}
        lead={series.lead}
        cards={series.items.length}
      />
      <StoryValuesSection {...values} />
      <StorySectionSkeleton
        kind="timeline"
        eyebrow={timeline.eyebrow}
        title={timeline.title}
        lead={timeline.lead}
      />
    </PageShell>
  );
};
