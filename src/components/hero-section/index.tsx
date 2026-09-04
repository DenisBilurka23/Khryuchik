import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import heroImage from "@/assets/MainHeroTransparent.png";
import { ArrowLink } from "@/components/arrow-link";
import { SectionEyebrow } from "@/components/section-eyebrow";
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
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg">
        <Box className={styles.panel}>
          <Box className={styles.layout}>
            <Box>
              <SectionEyebrow label={t("badge")} />

              <Typography variant="h1" className={styles.title}>
                {t("title")}
              </Typography>

              <Typography className={styles.lead}>{t("lead")}</Typography>

              <Typography className={styles.lead}>
                {t("leadSecondary")}
              </Typography>

              <Box className={styles.actions}>
                <Link href={`${homeHref}#books`}>
                  <Button
                    component="span"
                    variant="contained"
                    className={styles.action}
                  >
                    {t("primaryAction")}
                  </Button>
                </Link>

                <Link href={`${homeHref}#entertainment`}>
                  <Button
                    component="span"
                    variant="outlined"
                    className={`${styles.action} ${styles.secondaryButton}`}
                  >
                    {t("secondaryAction")}
                  </Button>
                </Link>
              </Box>
            </Box>

            <Box className={styles.illustrationArea}>
              <Image
                src={heroImage}
                alt={character.title}
                sizes="(max-width: 900px) 100vw, 700px"
                priority
                className={styles.illustration}
              />

              <Box className={styles.characterCard}>
                <Typography component="p" className={styles.characterTitle}>
                  {character.title}
                </Typography>

                <Typography className={styles.characterText}>
                  {character.text}
                </Typography>

                <ArrowLink
                  href={storyHref}
                  label={character.actionLabel}
                  className={styles.characterAction}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
