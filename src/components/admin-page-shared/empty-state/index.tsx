import { Paper, Stack, Typography } from "@mui/material";

import type { AdminEmptyStateProps } from "./types";

export const AdminEmptyState = ({
  title,
  description,
  action,
}: AdminEmptyStateProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "24px",
        border: "1px dashed #E8D6BF",
        bgcolor: "#FFFDF9",
      }}
    >
      <Stack gap={1.5} alignItems="flex-start">
        <Typography variant="h6" fontWeight={800}>
          {title}
        </Typography>
        <Typography color="text.secondary">{description}</Typography>
        {action}
      </Stack>
    </Paper>
  );
};

export type { AdminEmptyStateProps } from "./types";