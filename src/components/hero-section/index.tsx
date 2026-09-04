import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ArrowLink } from "@/components/arrow-link";
import { SectionEyebrow } from "@/components/section-eyebrow";
import {
  BRAND_HERO_IMAGE_HEIGHT,
  BRAND_HERO_IMAGE_SRC,
  BRAND_HERO_IMAGE_WIDTH,
} from "@/constants/brand";
import type { StorefrontDictionary } from "@/i18n/types";
import { getLocalizedPath } from "@/utils";

import styles from "./hero-section.module.css";
import type { HeroSectionProps } from "./types";

export const HeroSection = async ({ locale }: HeroSectionProps) => {
  const t = await getTranslations({ locale, namespace: "storefront.hero" });
  const character = t.raw(
    "character",
  ) as StorefrontDictionary["hero"]["character"];

  const homeHref = getLocalizedPath(locale, "/");
  const storyHref = getLocalizedPath(locale, "/story");

  return (
    <Box component="section">
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 2 } }}>
        <Box className={styles.panel}>
          <Box className={styles.layout}>
            <Box>
              <SectionEyebrow label={t("badge")} />

              <Typography variant="h1" sx={{ mt: 2.5 }}>
                {t("title")}
              </Typography>

              <Typography
                sx={{
                  mt: 2.5,
                  maxWidth: 500,
                  fontSize: { xs: 16, md: 17 },
                  lineHeight: 1.6,
                  color: "text.secondary",
                }}
              >
                {t("lead")}
              </Typography>

              <Typography
                sx={{
                  mt: 2,
                  maxWidth: 500,
                  fontSize: { xs: 16, md: 17 },
                  lineHeight: 1.6,
                  color: "text.secondary",
                }}
              >
                {t("leadSecondary")}
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                useFlexGap
                flexWrap="wrap"
                sx={{ mt: 4 }}
              >
                <Link
                  href={`${homeHref}#books`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button
                    component="span"
                    variant="contained"
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t("primaryAction")}
                  </Button>
                </Link>
                <Link
                  href={`${homeHref}#entertainment`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button
                    component="span"
                    variant="outlined"
                    className={styles.secondaryButton}
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t("secondaryAction")}
                  </Button>
                </Link>
              </Stack>
            </Box>

            <Box className={styles.illustrationArea}>
              <Image
                src={BRAND_HERO_IMAGE_SRC}
                alt={character.title}
                width={BRAND_HERO_IMAGE_WIDTH}
                height={BRAND_HERO_IMAGE_HEIGHT}
                sizes="(max-width: 900px) 100vw, 700px"
                priority
                className={styles.illustration}
              />

              <Box className={styles.characterCard}>
                <Typography
                  sx={{
                    fontFamily:
                      "var(--font-display, var(--font-display-fallback)), serif",
                    fontSize: 22,
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {character.title}
                </Typography>
                <Typography
                  sx={{
                    mt: 1.25,
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "text.secondary",
                  }}
                >
                  {character.text}
                </Typography>
                <ArrowLink
                  href={storyHref}
                  label={character.actionLabel}
                  sx={{ mt: 2 }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
