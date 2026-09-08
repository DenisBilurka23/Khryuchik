import { Box, Container, Typography } from "@mui/material";

import { ArrowLink } from "@/components/arrow-link";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { Pill, Plate } from "@/components/primitives";
import { BOOK_SERIES, BOOKS_CATEGORY_KEY } from "@/constants/catalog";
import { leadSx } from "@/theme/sx";
import type { BookSeries } from "@/types/catalog";
import { getCountLabel } from "@/utils/count-label";

import { SeriesArt } from "./series-art";
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
    <Box component="section" sx={{ pt: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 760, mb: 4 }}>
          <SectionEyebrow label={eyebrow} />

          <Typography variant="h2" sx={{ mt: 1.5 }}>
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 2,
              ...leadSx,
            }}
          >
            {lead}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "repeat(2, minmax(0, 1fr))",
            },
            gap: 3,
          }}
        >
          {items.map((item) => {
            const bookTotal = seriesCounts[item.series as BookSeries] ?? 0;
            const countLabel =
              bookTotal > 0
                ? getCountLabel(bookTotal, locale, bookCount)
                : emptyCount;

            return (
              <Plate
                key={item.name}
                interactive
                pad="none"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  borderRadius: "var(--radius-panel)",
                }}
              >
                <Box
                  sx={{
                    aspectRatio: "16 / 9",
                    background:
                      item.series === BOOK_SERIES.travel
                        ? "var(--color-products)"
                        : "var(--color-accent-pale)",
                  }}
                >
                  <SeriesArt series={item.series} alt={item.name} />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    p: { xs: "24px 20px", md: 3.5 },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography
                      component="p"
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        lineHeight: 1,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--color-accent)",
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Pill sx={{ padding: "7px 12px" }}>{item.age}</Pill>
                  </Box>

                  <Typography
                    variant="h3"
                    sx={{
                      mt: 2,
                      fontSize: { xs: 24, md: 28 },
                      lineHeight: 1.15,
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1.5,
                      fontSize: 15,
                      lineHeight: 1.65,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {item.desc}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mt: "auto",
                      pt: 2.5,
                    }}
                  >
                    {item.themes.map((theme) => (
                      <Pill key={theme} tone="accent">
                        {theme}
                      </Pill>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      pt: 3,
                    }}
                  >
                    <Typography
                      component="p"
                      sx={{ fontSize: 13, color: "var(--color-text-muted)" }}
                    >
                      {countLabel}
                    </Typography>

                    <ArrowLink
                      href={`${shopHref}?category=${BOOKS_CATEGORY_KEY}&series=${item.series}`}
                      label={openLabel}
                      size="sm"
                    />
                  </Box>
                </Box>
              </Plate>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export type { StorySeriesSectionProps } from "./types";
