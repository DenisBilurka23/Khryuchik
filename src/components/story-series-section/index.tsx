import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { InfoChip } from "../info-chip";
import { SeriesArt } from "./series-art";
import styles from "./story-series-section.module.css";
import type { StorySeriesSectionProps } from "./types";

export const StorySeriesSection = ({
  eyebrow,
  title,
  lead,
  openLabel,
  items,
  shopHref,
}: StorySeriesSectionProps) => {
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

        <Grid container spacing={3}>
          {items.map((item) => {
            const isAmber = item.tone === "amber";

            return (
              <Grid key={item.name} size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  className={[
                    styles.card,
                    isAmber ? styles.cardAmber : styles.cardPink,
                  ].join(" ")}
                >
                  <Box className={styles.art} aria-hidden>
                    <SeriesArt tone={item.tone} />
                  </Box>
                  <Box className={styles.body}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1.5 }}
                    >
                      <Typography className={styles.label}>
                        {item.label}
                      </Typography>
                      <Typography className={styles.age}>{item.age}</Typography>
                    </Stack>
                    <Typography
                      variant="h3"
                      sx={{ fontSize: { xs: 26, md: 32 }, mb: 1.5 }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ lineHeight: 1.8, mb: 2.5 }}
                    >
                      {item.desc}
                    </Typography>
                    <Stack
                      direction="row"
                      useFlexGap
                      flexWrap="wrap"
                      spacing={1}
                      sx={{ mb: 3 }}
                    >
                      {item.themes.map((theme) => (
                        <InfoChip key={theme} text={theme} variant="tag" />
                      ))}
                    </Stack>
                    <Box className={styles.foot}>
                      <Typography className={styles.count}>
                        {item.count}
                      </Typography>
                      <Link
                        href={shopHref}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Button
                          component="span"
                          variant="text"
                          endIcon={<ArrowForwardIcon />}
                          sx={{ color: isAmber ? "#c08148" : "primary.main" }}
                        >
                          {openLabel}
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};
