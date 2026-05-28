"use client";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";

import { InfoChip } from "../info-chip";
import styles from "./story-timeline-section.module.css";
import type { StoryTimelineSectionProps } from "./types";

export const StoryTimelineSection = ({
  eyebrow,
  title,
  lead,
  seriesLabels,
  ctaLabel,
  chapters,
  shopHref,
}: StoryTimelineSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(chapters.length > 2 ? 2 : 0);
  const safeIndex = Math.min(activeIndex, chapters.length - 1);
  const active = chapters[safeIndex];
  const lastIndex = Math.max(chapters.length - 1, 1);

  if (!active) {
    return null;
  }

  const seriesLabel =
    active.series === "small" ? seriesLabels.small : seriesLabels.travel;

  return (
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg">
        <Box className={styles.header}>
          <Typography className={styles.eyebrow}>{eyebrow}</Typography>
          <Typography
            variant="h2"
            sx={{ mt: 1.5, fontSize: { xs: 30, md: 44 } }}
          >
            {title}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.8 }}>
            {lead}
          </Typography>
        </Box>

        <Box className={styles.timeline}>
          <Box className={styles.rail}>
            <Box
              className={styles.railFill}
              style={{ width: `${(safeIndex / lastIndex) * 100}%` }}
            />
            {chapters.map((chapter, index) => {
              const nodeClassName = [
                styles.node,
                index === safeIndex ? styles.nodeActive : "",
                index < safeIndex ? styles.nodePassed : "",
                chapter.series === "travel" ? styles.nodeTravel : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={chapter.year}
                  type="button"
                  className={nodeClassName}
                  style={{ left: `${(index / lastIndex) * 100}%` }}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`${chapter.year} — ${chapter.title}`}
                  aria-pressed={index === safeIndex}
                >
                  <span className={styles.nodeDot} />
                  <span className={styles.nodeAge}>{chapter.age}</span>
                </button>
              );
            })}
          </Box>
        </Box>

        <Paper
          elevation={0}
          className={styles.detail}
          sx={{ p: { xs: 3, md: 6 } }}
        >
          <Box className={styles.detailGrid}>
            <Box>
              <Box
                className={[
                  styles.chip,
                  active.series === "travel"
                    ? styles.chipTravel
                    : styles.chipSmall,
                ].join(" ")}
              >
                {seriesLabel}
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 2 }}
              >
                {active.year} · {active.age}
              </Typography>
              <Typography
                variant="h3"
                sx={{ mt: 1, fontSize: { xs: 28, md: 38 } }}
              >
                {active.title}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: 2, lineHeight: 1.8 }}
              >
                {active.blurb}
              </Typography>
              <Stack
                direction="row"
                useFlexGap
                flexWrap="wrap"
                spacing={1}
                sx={{ mt: 3 }}
              >
                {active.tags.map((tag) => (
                  <InfoChip key={tag} text={tag} variant="tag" />
                ))}
              </Stack>
              <Link
                href={shopHref}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button
                  component="span"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ mt: 4 }}
                >
                  {ctaLabel.replace("{book}", active.book)}
                </Button>
              </Link>
            </Box>

            <Box className={styles.bookWrap}>
              <Box
                className={[
                  styles.book,
                  active.series === "travel"
                    ? styles.bookTravel
                    : styles.bookSmall,
                ].join(" ")}
              >
                <Typography className={styles.bookSeries}>
                  {seriesLabel}
                </Typography>
                <Typography className={styles.bookTitle}>
                  {active.book}
                </Typography>
                <Box className={styles.bookPig} aria-hidden>
                  🐷
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
