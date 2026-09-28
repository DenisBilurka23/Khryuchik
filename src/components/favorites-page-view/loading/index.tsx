import { Box, Skeleton, Typography } from "@mui/material";

import { Panel } from "@/components/primitives";
import { FAVORITES_SKELETON_CARD_COUNT } from "@/constants/loading";
import { cardFrameSx } from "@/theme/sx";

import type { FavoritesLoadingProps } from "./types";

const gridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(3, minmax(0, 1fr))",
  },
  gap: { xs: 2, md: 3 },
} as const;

const cardSx = {
  ...cardFrameSx,
  p: 2.25,
  borderRadius: "var(--radius-card)",
  boxShadow: "var(--shadow-card-soft)",
} as const;

export const FavoritesLoading = ({
  title,
  lead,
  status,
}: FavoritesLoadingProps) => (
  <Box role="status" aria-label={status}>
    <Panel tone="cream">
      <Box aria-hidden="true">
        <Box sx={{ mb: 3.5 }}>
          <Typography
            variant="h2"
            sx={{ fontSize: { xs: 22, md: 26 }, lineHeight: 1.2 }}
          >
            {title}
          </Typography>
          {lead ? (
            <Typography sx={{ mt: 1.25, color: "var(--color-text-secondary)" }}>
              {lead}
            </Typography>
          ) : null}
        </Box>

        <Box sx={gridSx}>
          {Array.from({ length: FAVORITES_SKELETON_CARD_COUNT }, (_, index) => (
            <Box key={index} sx={cardSx}>
              <Skeleton
                variant="rounded"
                sx={{ width: "100%", height: "auto" }}
                style={{ aspectRatio: "16 / 9" }}
              />
              <Skeleton
                variant="text"
                width="75%"
                height={32}
                sx={{ mt: 1.75 }}
              />
              <Skeleton variant="text" width="35%" sx={{ mt: 1.5 }} />
              <Skeleton variant="text" width="55%" />
            </Box>
          ))}
        </Box>
      </Box>
    </Panel>
  </Box>
);

export type { FavoritesLoadingProps } from "./types";
