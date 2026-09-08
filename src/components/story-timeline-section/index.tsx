"use client";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { Panel, Plate } from "@/components/primitives";
import { useAnimatedHeight } from "@/hooks/useAnimatedHeight";
import { leadSx } from "@/theme/sx";

import { TimelineTrack } from "./timeline-track";
import type { StoryTimelineSectionProps } from "./types";

const detailGridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 1fr) minmax(0, 0.9fr)",
  },
  gridTemplateAreas: {
    xs: '"text" "media" "cta"',
    md: '"text media" "cta media"',
  },
  alignItems: "center",
  columnGap: 6,
  rowGap: 3,
} as const;

const seriesLabelSx = {
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: "var(--radius-pill)",
  background: "var(--color-accent-tint)",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--color-accent)",
} as const;

const metaSx = {
  display: "block",
  mt: 2,
  fontSize: 13,
  color: "var(--color-text-secondary)",
} as const;

const subtitleSx = {
  mt: 1.5,
  fontSize: 15,
  lineHeight: 1.65,
  color: "var(--color-text-secondary)",
} as const;

const coverSx = {
  width: "100%",
  maxWidth: { xs: "min(100%, 360px)", md: 420 },
  maxHeight: 360,
  objectFit: "contain",
  borderRadius: "var(--radius-card)",
  boxShadow: "var(--shadow-card)",
} as const;

const coverFallbackSx = {
  display: "grid",
  placeItems: "center",
  width: 260,
  aspectRatio: "3 / 4",
  borderRadius: "var(--radius-card)",
  fontSize: 72,
} as const;

export const StoryTimelineSection = ({
  eyebrow,
  title,
  lead,
  ctaLabel,
  ctaLabelShort,
  books,
}: StoryTimelineSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(books.length > 2 ? 2 : 0);
  const safeIndex = Math.min(activeIndex, books.length - 1);
  const active = books[safeIndex];
  const { ref: detailRef, height: detailHeight } =
    useAnimatedHeight<HTMLDivElement>(active?.slug ?? "");

  if (!active) {
    return null;
  }

  const metaLine = [active.storyLabel, active.ageRating]
    .filter(Boolean)
    .join(" · ");

  return (
    <Box component="section" sx={{ pt: 4 }}>
      <Container maxWidth="lg">
        <Panel tone="blush">
          <Box sx={{ maxWidth: 760 }}>
            <SectionEyebrow label={eyebrow} />

            <Typography variant="h2" sx={{ mt: 1.5 }}>
              {title}
            </Typography>

            <Typography sx={{ mt: 2, ...leadSx }}>{lead}</Typography>
          </Box>

          <TimelineTrack
            books={books}
            activeIndex={safeIndex}
            onSelect={setActiveIndex}
          />

          <Plate pad="lg" sx={{ mt: 4 }}>
            <Box
              sx={{
                overflow: "hidden",
                height: detailHeight,
                transition: "height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                },
              }}
            >
              <Box ref={detailRef} sx={{ pb: 1 }}>
                <Box sx={detailGridSx}>
                  <Box sx={{ gridArea: "text" }}>
                    {active.seriesLabel ? (
                      <Box component="span" sx={seriesLabelSx}>
                        {active.seriesLabel}
                      </Box>
                    ) : null}

                    {metaLine ? (
                      <Typography component="p" sx={metaSx}>
                        {metaLine}
                      </Typography>
                    ) : null}

                    <Typography
                      variant="h3"
                      sx={{
                        mt: 1,
                        fontSize: { xs: 24, md: 28 },
                        lineHeight: 1.15,
                      }}
                    >
                      {active.title}
                    </Typography>

                    <Typography component="p" sx={subtitleSx}>
                      {active.subtitle}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      gridArea: "media",
                      display: "grid",
                      placeItems: "center",
                      alignSelf: "center",
                    }}
                  >
                    {active.thumbnail?.src ? (
                      <Box
                        component="img"
                        src={active.thumbnail.src}
                        alt={active.thumbnail.alt ?? active.title}
                        sx={coverSx}
                      />
                    ) : (
                      <Box
                        sx={{
                          ...coverFallbackSx,
                          background:
                            active.thumbnail?.bgColor ??
                            active.thumbnailBackgroundColor ??
                            "var(--color-accent-soft)",
                        }}
                      >
                        {active.emoji}
                      </Box>
                    )}
                  </Box>

                  <Box
                    sx={{
                      gridArea: "cta",
                      alignSelf: "start",
                      justifySelf: { xs: "stretch", md: "start" },
                    }}
                  >
                    <Link href={active.href}>
                      <Button
                        component="span"
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          minWidth: 160,
                          width: { xs: "100%", md: "auto" },
                        }}
                      >
                        <Box
                          component="span"
                          sx={{ display: { xs: "none", md: "inline" } }}
                        >
                          {ctaLabel.replace("{book}", active.title)}
                        </Box>
                        <Box
                          component="span"
                          sx={{ display: { xs: "inline", md: "none" } }}
                        >
                          {ctaLabelShort}
                        </Box>
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Plate>
        </Panel>
      </Container>
    </Box>
  );
};

export type { StoryTimelineSectionProps } from "./types";
