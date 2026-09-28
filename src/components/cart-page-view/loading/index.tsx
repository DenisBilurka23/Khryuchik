import { Box, Skeleton, Stack } from "@mui/material";

import { Plate } from "@/components/primitives";
import { CART_SKELETON_ITEM_COUNT } from "@/constants/loading";

import type { CartLoadingProps } from "./types";

const layoutSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    lg: "minmax(0, 1fr) 380px",
  },
  alignItems: "flex-start",
  gap: 3,
  mt: 4,
} as const;

const itemCardSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "140px minmax(0, 1fr)",
  },
  gap: { xs: 2, sm: 3 },
  p: { xs: 2.5, sm: 3 },
} as const;

const thumbnailSx = {
  width: { xs: "100%", sm: 140 },
  height: { xs: 180, sm: 140 },
  borderRadius: "var(--radius-card)",
} as const;

export const CartLoading = ({ status }: CartLoadingProps) => (
  <Box role="status" aria-label={status} sx={layoutSx}>
    <Stack aria-hidden="true" spacing={2}>
      {Array.from({ length: CART_SKELETON_ITEM_COUNT }, (_, index) => (
        <Plate key={index} pad="none" sx={itemCardSx}>
          <Skeleton variant="rounded" sx={thumbnailSx} />
          <Box sx={{ minWidth: 0 }}>
            <Skeleton variant="text" width="70%" height={34} />
            <Skeleton variant="text" width="40%" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="30%" />
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mt: 2.5 }}
            >
              <Skeleton variant="rounded" width={40} height={40} />
              <Skeleton variant="rounded" width={48} height={40} />
              <Skeleton variant="rounded" width={40} height={40} />
              <Skeleton
                variant="text"
                width={90}
                height={36}
                sx={{ ml: "auto" }}
              />
            </Stack>
          </Box>
        </Plate>
      ))}
    </Stack>

    <Plate
      aria-hidden="true"
      sx={{ position: { lg: "sticky" }, top: { lg: 100 } }}
    >
      <Skeleton variant="text" width="60%" height={40} />
      <Skeleton variant="rounded" height={48} sx={{ mt: 2.75 }} />
      <Stack spacing={1.5} sx={{ mt: 2.75 }}>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="85%" />
      </Stack>
      <Skeleton variant="text" width="100%" height={40} sx={{ mt: 2.75 }} />
      <Skeleton variant="rounded" height={48} sx={{ mt: 3 }} />
      <Skeleton variant="rounded" height={48} sx={{ mt: 1.5 }} />
    </Plate>
  </Box>
);

export type { CartLoadingProps } from "./types";
