import { Box, Typography } from "@mui/material";

import { BrandCurl } from "../brand-curl";

import styles from "./section-eyebrow.module.css";
import type { SectionEyebrowProps } from "./types";

export const SectionEyebrow = ({ label, className }: SectionEyebrowProps) => {
  return (
    <Box className={[styles.root, className].filter(Boolean).join(" ")}>
      <Typography component="span" className={styles.label}>
        {label}
      </Typography>
      <BrandCurl />
    </Box>
  );
};

export type { SectionEyebrowProps } from "./types";
