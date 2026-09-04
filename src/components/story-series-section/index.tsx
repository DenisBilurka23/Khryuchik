import { Box, Container, Paper, Typography } from "@mui/material";

import { ArrowLink } from "@/components/arrow-link";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { BOOK_SERIES, BOOKS_CATEGORY_KEY } from "@/constants/catalog";
import type { BookSeries } from "@/types/catalog";
import { getCountLabel } from "@/utils/count-label";

import { InfoChip } from "../info-chip";

import { SeriesArt } from "./series-art";
import styles from "./story-series-section.module.css";
import type { StorySeriesSectionProps } from "./types";

export const StorySeriesSection = ({
  eyebrow,
  title,
  lead,
  openLabel,
  bookCount,
  emptyCount,
  items,
  locale,
  shopHref,
  seriesCounts,
}: StorySeriesSectionProps) => {
  return (
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg">
        <Box className={styles.header}>
          <SectionEyebrow label={eyebrow} />

          <Typography variant="h2" className={styles.title}>
            {title}
          </Typography>

          <Typography className={styles.lead}>{lead}</Typography>
        </Box>

        <Box className={styles.grid}>
          {items.map((item) => {
            const bookTotal = seriesCounts[item.series as BookSeries] ?? 0;
            const countLabel =
              bookTotal > 0
                ? getCountLabel(bookTotal, locale, bookCount)
                : emptyCount;

            return (
              <Paper key={item.name} elevation={0} className={styles.card}>
                <Box
                  className={[
                    styles.art,
                    item.series === BOOK_SERIES.travel ? styles.artTravel : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <SeriesArt series={item.series} alt={item.name} />
                </Box>

                <Box className={styles.body}>
                  <Box className={styles.meta}>
                    <Typography component="p" className={styles.label}>
                      {item.label}
                    </Typography>
                    <Typography component="span" className={styles.age}>
                      {item.age}
                    </Typography>
                  </Box>

                  <Typography variant="h3" className={styles.name}>
                    {item.name}
                  </Typography>

                  <Typography className={styles.desc}>{item.desc}</Typography>

                  <Box className={styles.themes}>
                    {item.themes.map((theme) => (
                      <InfoChip key={theme} text={theme} variant="tag" />
                    ))}
                  </Box>

                  <Box className={styles.foot}>
                    <Typography component="p" className={styles.count}>
                      {countLabel}
                    </Typography>

                    <ArrowLink
                      href={`${shopHref}?category=${BOOKS_CATEGORY_KEY}&series=${item.series}`}
                      label={openLabel}
                      size="sm"
                    />
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export type { StorySeriesSectionProps } from "./types";
