import { getTranslations } from "next-intl/server";

import { getBookCountsBySeries } from "@/server/catalog/services/catalog.service";
import { getLocalizedPath } from "@/utils";

import { NewsletterSection } from "@/components/newsletter-section";
import { StoryAuthorSection } from "@/components/story-author-section";
import { StorySeriesSection } from "@/components/story-series-section";
import { StoryTimelineSection } from "@/components/story-timeline-section";
import { StoryValuesSection } from "@/components/story-values-section";
import { PageShell } from "@/components/page-shell";
import type { StoryPageDictionary, StoryPageViewProps } from "./types";

export const StoryPageView = async ({
  locale,
  country,
  timelineBooks,
}: StoryPageViewProps) => {
  const [t, seriesCounts] = await Promise.all([
    getTranslations({ locale, namespace: "storefront.storyPage" }),
    getBookCountsBySeries(country),
  ]);
  const timeline = t.raw("timeline") as StoryPageDictionary["timeline"];
  const series = t.raw("series") as StoryPageDictionary["series"];
  const values = t.raw("values") as StoryPageDictionary["values"];
  const author = t.raw("author") as StoryPageDictionary["author"];
  const shopHref = getLocalizedPath(locale, "/shop");

  return (
    <PageShell>
      <StorySeriesSection
        {...series}
        locale={locale}
        shopHref={shopHref}
        seriesCounts={seriesCounts}
      />
      <StoryValuesSection {...values} />
      <StoryTimelineSection {...timeline} books={timelineBooks} />
      <StoryAuthorSection {...author} />
      <NewsletterSection locale={locale} />
    </PageShell>
  );
};

export type { StoryPageViewProps } from "./types";
