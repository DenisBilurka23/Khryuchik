import { Stack, Typography } from "@mui/material";

import { BrandCurl } from "../brand-curl";

import type { SectionEyebrowProps } from "./types";

export const SectionEyebrow = ({ label, sx }: SectionEyebrowProps) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={sx}>
      <Typography
        sx={{
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          fontSize: 12,
          fontWeight: 700,
          color: "var(--color-accent)",
        }}
      >
        {label}
      </Typography>
      <BrandCurl />
    </Stack>
  );
};

export type { SectionEyebrowProps } from "./types";
