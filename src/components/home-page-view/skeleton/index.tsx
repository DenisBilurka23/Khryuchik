import { Box, Container, Skeleton } from "@mui/material";

import { Panel } from "@/components/primitives";
import { HOME_SKELETON_CONFIG } from "@/constants/loading";

import type { HomeSectionSkeletonProps } from "../types";

const gridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "repeat(2, minmax(0, 1fr))",
    md: "repeat(3, minmax(0, 1fr))",
    lg: "repeat(4, minmax(0, 1fr))",
  },
  gap: 3,
  mt: 4,
} as const;

const booksGridSx = {
  ...gridSx,
  gridTemplateColumns: {
    ...gridSx.gridTemplateColumns,
    xs: "minmax(0, 1fr)",
    lg: "repeat(3, minmax(0, 1fr))",
  },
} as const;

const sectionSx = { py: { xs: 1.5, md: 2 } } as const;

const cardSx = {
  p: 1.5,
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-card)",
  background: "var(--color-card)",
} as const;

const coverSx = {
  width: "100%",
  height: "auto",
  borderRadius: "var(--radius-card)",
} as const;

export const HomeSectionSkeleton = ({ kind }: HomeSectionSkeletonProps) => {
  const { tone, cards, aspectRatio } = HOME_SKELETON_CONFIG[kind];

  return (
    <Box component="section" id={kind} sx={sectionSx}>
      <Container maxWidth="lg">
        <Panel tone={tone}>
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={240} height={48} />
          <Box sx={kind === "books" ? booksGridSx : gridSx}>
            {Array.from({ length: cards }, (_, index) => (
              <Box key={index} sx={cardSx}>
                <Skeleton
                  variant="rounded"
                  sx={coverSx}
                  style={{ aspectRatio }}
                />
                <Skeleton variant="text" width="70%" sx={{ mt: 1.5 }} />
                <Skeleton variant="text" width="40%" />
              </Box>
            ))}
          </Box>
        </Panel>
      </Container>
    </Box>
  );
};
