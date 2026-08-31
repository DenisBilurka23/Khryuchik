import type { Locale } from "@/i18n/config";
import type { BookSeries } from "@/types/catalog";
import type { StoryPageLabels } from "@/i18n/types";

export type StorySeriesSectionProps = StoryPageLabels["series"] & {
  locale: Locale;
  shopHref: string;
  seriesCounts: Record<BookSeries, number>;
};
