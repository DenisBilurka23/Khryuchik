import { Box, Stack, Typography } from "@mui/material";

import { BRAND_LOGO_MARK_SIZE } from "@/constants/brand";

import { LogoMark } from "../logo-mark";
import type { LogoProps } from "../types";
import styles from "./logo.module.css";

export const Logo = ({
  title,
  subtitle,
  textSx,
  markSize = BRAND_LOGO_MARK_SIZE,
}: LogoProps) => {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <LogoMark
        alt={title}
        size={markSize}
        sizes={`${markSize * 2}px`}
        priority
        sx={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
      />
      <Box sx={textSx}>
        <Typography className={styles.title}>{title}</Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Box>
    </Stack>
  );
};
