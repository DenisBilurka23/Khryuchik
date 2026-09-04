import { Box, Typography } from "@mui/material";
import Image from "next/image";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { BRAND_SHOP_HERO_IMAGE_SRC } from "@/constants/brand";

import styles from "./shop-hero.module.css";
import type { ShopHeroProps } from "./types";

export const ShopHero = ({ eyebrow, title, lead }: ShopHeroProps) => {
  return (
    <Box className={styles.panel}>
      <Box className={styles.content}>
        <SectionEyebrow label={eyebrow} />

        <Typography variant="h1" className={styles.title}>
          {title}
        </Typography>

        <Typography className={styles.lead}>{lead}</Typography>
      </Box>

      <Box className={styles.illustrationArea}>
        <Image
          src={BRAND_SHOP_HERO_IMAGE_SRC}
          alt={title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 55vw, 760px"
          priority
          className={styles.illustration}
        />
      </Box>
    </Box>
  );
};

export type { ShopHeroProps } from "./types";
