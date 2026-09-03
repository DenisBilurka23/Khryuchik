import { Box } from "@mui/material";

import type { BrandCurlProps } from "./types";

export const BrandCurl = ({ width = 34, sx }: BrandCurlProps) => {
  return (
    <Box
      aria-hidden
      component="svg"
      viewBox="0 0 34 12"
      fill="none"
      sx={[
        {
          width,
          height: "auto",
          flexShrink: 0,
          color: "var(--color-border-rose)",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <path
        d="M1 8.5c2.4 0 3.2-6.2 6.1-6.2 2.6 0 2.9 7.4 5.9 7.4 3 0 3-7.4 6-7.4 2.9 0 3 7.4 6 7.4 2.4 0 3.4-3.4 8-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </Box>
  );
};

export type { BrandCurlProps } from "./types";
