import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { getLocalizedPath } from "@/utils";

import { NewsletterSection } from "@/components/newsletter-section";
import { StoryAuthorSection } from "@/components/story-author-section";
import { StorySeriesSection } from "@/components/story-series-section";
import { StoryTimelineSection } from "@/components/story-timeline-section";
import { StoryValuesSection } from "@/components/story-values-section";
import { PageShell } from "@/components/page-shell";
import type { Locale } from "@/i18n/config";
import type { BookSeries } from "@/types/catalog";
import type { StoryTimelineBook } from "@/types/story";
import { StorySectionSkeleton } from "./skeleton";
import type { StoryPageDictionary, StoryPageViewProps } from "./types";

type StorySeriesDataProps = {
  labels: StoryPageDictionary["series"];
  locale: Locale;
  shopHref: string;
  counts: Promise<Record<BookSeries, number>>;
};

const StorySeriesData = async ({
  labels,
  locale,
  shopHref,
  counts,
}: StorySeriesDataProps) => (
  <StorySeriesSection
    {...labels}
    locale={locale}
    shopHref={shopHref}
    seriesCounts={await counts}
  />
);

type StoryTimelineDataProps = {
  labels: StoryPageDictionary["timeline"];
  books: Promise<StoryTimelineBook[]>;
};

const StoryTimelineData = async ({ labels, books }: StoryTimelineDataProps) => (
  <StoryTimelineSection {...labels} books={await books} />
);

export const StoryPageView = async ({
  locale,
  timelineBooks,
  seriesCounts,
}: StoryPageViewProps) => {
  const t = await getTranslations({
    locale,
    namespace: "storefront.storyPage",
  });
  const timeline = t.raw("timeline") as StoryPageDictionary["timeline"];
  const series = t.raw("series") as StoryPageDictionary["series"];
  const values = t.raw("values") as StoryPageDictionary["values"];
  const author = t.raw("author") as StoryPageDictionary["author"];
  const shopHref = getLocalizedPath(locale, "/shop");

  return (
    <PageShell>
      <Suspense
        fallback={
          <StorySectionSkeleton
            kind="series"
            eyebrow={series.eyebrow}
            title={series.title}
            lead={series.lead}
            cards={series.items.length}
          />
        }
      >
        <StorySeriesData
          labels={series}
          locale={locale}
          shopHref={shopHref}
          counts={seriesCounts}
        />
      </Suspense>
      <StoryValuesSection {...values} />
      <Suspense
        fallback={
          <StorySectionSkeleton
            kind="timeline"
            eyebrow={timeline.eyebrow}
            title={timeline.title}
            lead={timeline.lead}
          />
        }
      >
        <StoryTimelineData labels={timeline} books={timelineBooks} />
      </Suspense>
      <StoryAuthorSection {...author} />
      <Suspense fallback={null}>
        <NewsletterSection locale={locale} />
      </Suspense>
    </PageShell>
  );
};

export { StoryPageSkeleton } from "./page-skeleton";
export type { StoryPageSkeletonProps, StoryPageViewProps } from "./types";
