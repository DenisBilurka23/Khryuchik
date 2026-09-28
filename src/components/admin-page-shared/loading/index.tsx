import { Box, Card, CardContent, Paper, Skeleton, Stack } from "@mui/material";

import {
  ADMIN_SKELETON_ROW_COUNT,
  ADMIN_SKELETON_STAT_COUNT,
} from "@/constants/loading";

import type { AdminPageLoadingProps } from "./types";

const heroSx = {
  p: { xs: 3, md: 4 },
  border: "1px solid",
  borderColor: "divider",
  borderRadius: "var(--radius-panel)",
} as const;

const dashboardGridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(2, minmax(0, 1fr))",
    xl: "repeat(4, minmax(0, 1fr))",
  },
  gap: 3,
} as const;

export const AdminPageLoading = ({
  variant = "table",
}: AdminPageLoadingProps) => (
  <Stack aria-hidden="true" gap={3}>
    <Paper elevation={0} sx={heroSx}>
      <Skeleton variant="rounded" width={96} height={32} />
      <Skeleton variant="text" width="50%" height={64} sx={{ mt: 2 }} />
      <Skeleton variant="text" width="75%" height={28} />
    </Paper>

    {variant === "dashboard" ? (
      <Box sx={dashboardGridSx}>
        {Array.from({ length: ADMIN_SKELETON_STAT_COUNT }, (_, index) => (
          <Card key={index}>
            <CardContent>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" height={44} />
            </CardContent>
          </Card>
        ))}
      </Box>
    ) : (
      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Skeleton variant="text" width="35%" height={40} sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {Array.from({ length: ADMIN_SKELETON_ROW_COUNT }, (_, index) => (
              <Stack key={index} direction="row" spacing={2}>
                <Skeleton variant="text" width="28%" />
                <Skeleton variant="text" width="42%" />
                <Skeleton variant="text" width="20%" />
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    )}
  </Stack>
);

export type { AdminPageLoadingProps } from "./types";
