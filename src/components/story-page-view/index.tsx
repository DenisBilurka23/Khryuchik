import { Box } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { getBookCountsBySeries } from "@/server/catalog/services/catalog.service";
import { getLocalizedPath } from "@/utils";

import { NewsletterSection } from "../newsletter-section";
import { StoryAuthorSection } from "../story-author-section";
import { StorySeriesSection } from "../story-series-section";
import { StoryTimelineSection } from "../story-timeline-section";
import { StoryValuesSection } from "../story-values-section";
import storefrontStyles from "../storefront/storefront.module.css";
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
    <Box className={storefrontStyles.pageShell} sx={{ color: "text.primary" }}>
      <Box className={storefrontStyles.pageContent}>
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
      </Box>
    </Box>
  );
};

export type { StoryPageViewProps } from "./types";
