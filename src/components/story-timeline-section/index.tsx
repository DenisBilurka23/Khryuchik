"use client";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { useAnimatedHeight } from "@/hooks/useAnimatedHeight";

import styles from "./story-timeline-section.module.css";
import type { StoryTimelineSectionProps } from "./types";

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
  const lastIndex = Math.max(books.length - 1, 1);
  const { ref: detailRef, height: detailHeight } =
    useAnimatedHeight<HTMLDivElement>(active?.slug ?? "");

  if (!active) {
    return null;
  }

  const metaLine = [active.storyLabel, active.ageRating]
    .filter(Boolean)
    .join(" · ");

  return (
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg">
        <Box className={styles.panel}>
          <Box className={styles.header}>
            <SectionEyebrow label={eyebrow} />

            <Typography variant="h2" className={styles.title}>
              {title}
            </Typography>

            <Typography className={styles.lead}>{lead}</Typography>
          </Box>

          <Box className={styles.timeline}>
            <Box className={styles.rail}>
              <Box
                className={styles.railFill}
                style={{ width: `${(safeIndex / lastIndex) * 100}%` }}
              />
              {books.map((book, index) => {
                const nodeClassName = [
                  styles.node,
                  index === safeIndex ? styles.nodeActive : "",
                  index < safeIndex ? styles.nodePassed : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={book.slug}
                    type="button"
                    className={nodeClassName}
                    style={{ left: `${(index / lastIndex) * 100}%` }}
                    onClick={() => setActiveIndex(index)}
                    aria-label={book.title}
                    aria-pressed={index === safeIndex}
                  >
                    <span className={styles.nodeDot} />
                    {book.ageRating ? (
                      <span className={styles.nodeAge}>{book.ageRating}</span>
                    ) : null}
                  </button>
                );
              })}
            </Box>
          </Box>

          <Paper elevation={0} className={styles.detail}>
            <Box className={styles.detailAnim} style={{ height: detailHeight }}>
              <Box ref={detailRef} className={styles.detailBody}>
                <Box className={styles.detailGrid}>
                  <Box className={styles.detailText}>
                    {active.seriesLabel ? (
                      <Box component="span" className={styles.chip}>
                        {active.seriesLabel}
                      </Box>
                    ) : null}
                    {metaLine ? (
                      <Typography component="p" className={styles.meta}>
                        {metaLine}
                      </Typography>
                    ) : null}
                    <Typography variant="h3" className={styles.detailTitle}>
                      {active.title}
                    </Typography>
                    <Typography component="p" className={styles.subtitle}>
                      {active.subtitle}
                    </Typography>
                  </Box>

                  <Box className={styles.bookWrap}>
                    {active.thumbnail?.src ? (
                      <Box
                        component="img"
                        src={active.thumbnail.src}
                        alt={active.thumbnail.alt ?? active.title}
                        className={styles.bookImage}
                      />
                    ) : (
                      <Box
                        className={styles.bookFallback}
                        style={{
                          background:
                            active.thumbnail?.bgColor ??
                            active.thumbnailBackgroundColor ??
                            undefined,
                        }}
                      >
                        {active.emoji}
                      </Box>
                    )}
                  </Box>

                  <Link href={active.href} className={styles.ctaLink}>
                    <Button
                      component="span"
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      className={styles.ctaButton}
                    >
                      <Box component="span" className={styles.ctaTextFull}>
                        {ctaLabel.replace("{book}", active.title)}
                      </Box>
                      <Box component="span" className={styles.ctaTextShort}>
                        {ctaLabelShort}
                      </Box>
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export type { StoryTimelineSectionProps } from "./types";
