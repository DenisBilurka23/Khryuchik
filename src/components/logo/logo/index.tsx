import { Box, Stack, Typography } from "@mui/material";

import { BRAND_LOGO_MARK_SIZE } from "@/constants/brand";

import { LogoMark } from "../logo-mark";
import type { LogoProps } from "../types";

export const Logo = ({
  title,
  subtitle,
  textSx,
  subtitleSx,
  markSize = BRAND_LOGO_MARK_SIZE,
}: LogoProps) => {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <LogoMark
        alt={title}
        size={markSize}
        sizes={`${markSize * 2}px`}
        priority
        sx={{ boxShadow: "var(--shadow-card)" }}
      />
      <Box sx={textSx}>
        <Typography
          sx={{
            fontFamily:
              "var(--font-display, var(--font-display-fallback)), serif",
            fontWeight: 600,
            fontSize: 24,
            lineHeight: 1.1,
          }}
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography
            sx={[
              {
                mt: "2px",
                fontSize: 11.5,
                letterSpacing: "0.01em",
                color: "var(--color-text-muted)",
              },
              ...(Array.isArray(subtitleSx) ? subtitleSx : [subtitleSx]),
            ]}
          >
            {subtitle}
          </Typography>
        ) : null}
      </Box>
    </Stack>
  );
};
