import { Box, Container, Skeleton, Stack, Typography } from "@mui/material";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { Panel, Plate } from "@/components/primitives";
import { STORY_TIMELINE_SKELETON_MARKERS } from "@/constants/loading";
import { leadSx } from "@/theme/sx";

import type { StorySectionSkeletonProps } from "./types";

const seriesGridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "repeat(2, minmax(0, 1fr))",
  },
  gap: 3,
} as const;

const timelineDetailSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 1fr) minmax(0, 0.9fr)",
  },
  gap: 4,
  mt: 4,
} as const;

export const StorySectionSkeleton = ({
  kind,
  eyebrow,
  title,
  lead,
  cards = 0,
}: StorySectionSkeletonProps) => {
  const heading = (
    <Box sx={{ maxWidth: 760, mb: 4 }}>
      <SectionEyebrow label={eyebrow} />
      <Typography variant="h2" sx={{ mt: 1.5 }}>
        {title}
      </Typography>
      <Typography sx={{ mt: 2, ...leadSx }}>{lead}</Typography>
    </Box>
  );

  if (kind === "series") {
    return (
      <Box component="section" sx={{ pt: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          {heading}
          <Box aria-hidden="true" sx={seriesGridSx}>
            {Array.from({ length: cards }, (_, index) => (
              <Plate key={index} pad="none" sx={{ overflow: "hidden" }}>
                <Skeleton
                  variant="rounded"
                  sx={{ width: "100%", height: "auto" }}
                  style={{ aspectRatio: "16 / 9" }}
                />
                <Box sx={{ p: { xs: "24px 20px", md: 3.5 } }}>
                  <Skeleton variant="text" width="55%" height={36} />
                  <Skeleton variant="text" width="85%" />
                  <Skeleton variant="text" width="70%" />
                </Box>
              </Plate>
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="section" sx={{ pt: 4 }}>
      <Container maxWidth="lg">
        <Panel tone="blush">
          {heading}
          <Stack aria-hidden="true" direction="row" flexWrap="wrap" gap={2}>
            {Array.from(
              { length: STORY_TIMELINE_SKELETON_MARKERS },
              (_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  width={112}
                  height={44}
                />
              ),
            )}
          </Stack>
          <Plate pad="lg" sx={timelineDetailSx}>
            <Stack aria-hidden="true" spacing={1.5}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="75%" height={40} />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="80%" />
            </Stack>
            <Skeleton
              aria-hidden="true"
              variant="rounded"
              sx={{ width: "100%", height: { xs: 220, md: 320 } }}
            />
          </Plate>
        </Panel>
      </Container>
    </Box>
  );
};

export type { StorySectionSkeletonProps } from "./types";
