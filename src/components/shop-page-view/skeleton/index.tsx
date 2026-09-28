import { Box, Skeleton } from "@mui/material";

import {
  SHOP_SKELETON_CARD_COUNT,
  SHOP_SKELETON_FILTER_COUNT,
} from "@/constants/loading";
import { cardFrameSx } from "@/theme/sx";

const filtersSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1.5,
  mt: 3.5,
} as const;

const gridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(3, minmax(0, 1fr))",
  },
  gap: 3,
  mt: 3,
} as const;

const thumbnailSx = {
  width: "100%",
  height: "auto",
  aspectRatio: "16 / 9",
  borderRadius: "var(--radius-card)",
} as const;

const cardSx = {
  ...cardFrameSx,
  p: 2.25,
  borderRadius: "var(--radius-card)",
  boxShadow: "var(--shadow-card-soft)",
} as const;

const searchRowSx = {
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  alignItems: { xs: "stretch", md: "center" },
  justifyContent: "space-between",
  gap: { xs: 2, md: 3 },
  mt: 3.5,
} as const;

export const ShopCatalogSkeleton = () => (
  <>
    <Box sx={filtersSx}>
      {Array.from({ length: SHOP_SKELETON_FILTER_COUNT }, (_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          width={112}
          height={40}
          sx={{ borderRadius: "var(--radius-pill)" }}
        />
      ))}
    </Box>

    <Box sx={searchRowSx}>
      <Skeleton variant="text" width={120} />
      <Skeleton
        variant="rounded"
        height={56}
        sx={{
          width: { xs: "100%", md: 320 },
          borderRadius: "var(--radius-field)",
        }}
      />
    </Box>

    <Box sx={gridSx}>
      {Array.from({ length: SHOP_SKELETON_CARD_COUNT }, (_, index) => (
        <Box key={index} sx={cardSx}>
          <Skeleton variant="rounded" sx={thumbnailSx} />
          <Skeleton variant="text" width="70%" height={32} sx={{ mt: 1.5 }} />
          <Skeleton variant="text" width="40%" sx={{ mt: 1.25 }} />
          <Skeleton variant="text" width="45%" />
        </Box>
      ))}
    </Box>
  </>
);
