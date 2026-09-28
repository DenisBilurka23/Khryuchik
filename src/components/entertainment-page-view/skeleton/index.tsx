import { Box, Skeleton } from "@mui/material";
import { ENTERTAINMENT_SKELETON_CARD_COUNT } from "@/constants/loading";
import { cardFrameSx } from "@/theme/sx";

const gridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(2, minmax(0, 1fr))",
    md: "repeat(3, minmax(0, 1fr))",
    lg: "repeat(4, minmax(0, 1fr))",
  },
  gap: 3,
  mt: 3.5,
} as const;

const posterSx = {
  width: "100%",
  height: "auto",
  aspectRatio: "1 / 1",
  borderRadius: "var(--radius-field)",
} as const;

const cardSx = {
  ...cardFrameSx,
  p: 1.5,
  borderRadius: "var(--radius-card)",
  boxShadow: "none",
} as const;

export const EntertainmentCatalogSkeleton = () => (
  <Box sx={gridSx}>
    {Array.from({ length: ENTERTAINMENT_SKELETON_CARD_COUNT }, (_, index) => (
      <Box key={index} sx={cardSx}>
        <Skeleton variant="rounded" sx={posterSx} />
        <Skeleton variant="text" width="80%" sx={{ mt: 1.75 }} />
        <Skeleton variant="text" width="40%" sx={{ mt: 1.5 }} />
      </Box>
    ))}
  </Box>
);
