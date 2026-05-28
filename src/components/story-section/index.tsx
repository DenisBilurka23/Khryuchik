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
import { getTranslations } from "next-intl/server";

import type { StorefrontDictionary } from "@/i18n/types";
import { getLocalizedPath } from "@/utils";
import styles from "./story-section.module.css";
import type { StorySectionProps } from "./types";

export const StorySection = async ({ locale }: StorySectionProps) => {
  const t = await getTranslations({
    locale,
    namespace: "storefront.storySection",
  });
  const features = t.raw(
    "features",
  ) as StorefrontDictionary["storySection"]["features"];
  const storyHref = getLocalizedPath(locale, "/story");

  return (
    <Box component="section" id="story" className={styles.section}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              className={styles.storyCard}
              sx={{ p: { xs: 4, md: 5 } }}
            >
              <Typography className={styles.eyebrow}>{t("eyebrow")}</Typography>
              <Typography
                variant="h2"
                sx={{ mt: 2, fontSize: { xs: 32, md: 42 } }}
              >
                {t("title")}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: 3, mb: 4, maxWidth: 620, lineHeight: 1.8 }}
              >
                {t("text")}
              </Typography>
              <Link
                href={storyHref}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button
                  component="span"
                  variant="contained"
                  className={styles.actionButton}
                >
                  {t("actionLabel")}
                </Button>
              </Link>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              {features.map((feature) => (
                <Paper
                  key={feature.title}
                  elevation={0}
                  className={styles.featureCard}
                  sx={{ p: 4 }}
                >
                  <Typography sx={{ fontSize: 30 }}>{feature.emoji}</Typography>
                  <Typography sx={{ mt: 2, fontSize: 24, fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1.5, lineHeight: 1.8 }}
                  >
                    {feature.text}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
