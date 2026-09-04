import { Box, Typography } from "@mui/material";
import Image from "next/image";

import contactHeroImage from "@/assets/ContactsHero.png";
import { SectionEyebrow } from "@/components/section-eyebrow";

import styles from "./contact-hero.module.css";
import type { ContactHeroProps } from "./types";

export const ContactHero = ({
  eyebrow,
  titlePrefix,
  titleAccent,
  lede,
}: ContactHeroProps) => {
  return (
    <Box className={styles.panel}>
      <Box className={styles.content}>
        <SectionEyebrow label={eyebrow} sx={{ justifyContent: "center" }} />

        <Typography variant="h1" className={styles.title}>
          {titlePrefix} <em>{titleAccent}</em>
        </Typography>

        <Typography className={styles.lede}>{lede}</Typography>
      </Box>

      <Box className={styles.illustrationArea}>
        <Image
          src={contactHeroImage}
          alt=""
          aria-hidden
          sizes="(max-width: 767px) 100vw, 1280px"
          priority
          className={styles.illustration}
        />
      </Box>
    </Box>
  );
};

export type { ContactHeroProps } from "./types";
