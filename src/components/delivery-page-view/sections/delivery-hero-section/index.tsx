import { Box, Container, Typography } from "@mui/material";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { getCountryDisplayName } from "@/utils";

import styles from "./delivery-hero-section.module.css";
import { RegionMap } from "./region-map";
import type { DeliveryHeroSectionProps } from "./types";

export const DeliveryHeroSection = ({
  eyebrow,
  title,
  lede,
  highlights,
  options,
  mapBadgeLabel,
  mapCity,
  locale,
  country,
}: DeliveryHeroSectionProps) => {
  const activeCountryLabel =
    options[country]?.country ?? getCountryDisplayName(locale, country);

  return (
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg">
        <Box className={styles.panel}>
          <Box className={styles.content}>
            <SectionEyebrow label={eyebrow} />

            <Typography variant="h1" className={styles.title}>
              {title.lines.map((line) => (
                <Box component="span" key={line} className={styles.titleLine}>
                  {line}
                </Box>
              ))}
              <Box component="span" className={styles.titleAccent}>
                {title.accent}
              </Box>
            </Typography>

            <Typography className={styles.lede}>{lede}</Typography>

            <Box className={styles.highlights}>
              {highlights.map((highlight) => (
                <Box key={highlight} className={styles.highlight}>
                  <Box
                    component="span"
                    className={styles.highlightDot}
                    aria-hidden
                  />
                  {highlight}
                </Box>
              ))}
            </Box>
          </Box>

          <Box className={styles.mapCard}>
            <RegionMap country={country} city={mapCity} />

            <Box className={styles.mapBadge}>
              <Box
                component="span"
                className={styles.mapBadgeDot}
                aria-hidden
              />
              {mapBadgeLabel}{" "}
              <Box component="strong" className={styles.mapBadgeCountry}>
                {activeCountryLabel}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export type { DeliveryHeroSectionProps } from "./types";
