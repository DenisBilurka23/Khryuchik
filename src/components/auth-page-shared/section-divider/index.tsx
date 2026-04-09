import { Divider, Stack, Typography } from "@mui/material";

import type { AuthSectionDividerProps } from "./types";

export const AuthSectionDivider = ({ label }: AuthSectionDividerProps) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Divider sx={{ flex: 1 }} />
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Divider sx={{ flex: 1 }} />
  </Stack>
);

export type { AuthSectionDividerProps } from "./types";