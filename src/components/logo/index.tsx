import { Box, Stack, Typography } from "@mui/material";

import styles from "./logo.module.css";
import type { LogoProps } from "./types";

export const Logo = ({ title, subtitle }: LogoProps) => {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box className={styles.logoMark}>🐷</Box>
      <Box>
        <Typography className={styles.title}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );
};
