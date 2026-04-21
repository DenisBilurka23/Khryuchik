import { Box, Typography } from "@mui/material";

import type { AdminCheckboxFieldProps } from "./types";

export const AdminCheckboxField = ({ control, label }: AdminCheckboxFieldProps) => {
  return (
    <Box
      component="label"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        minHeight: 40,
        cursor: "pointer",
      }}
    >
      {control}
      <Typography>{label}</Typography>
    </Box>
  );
};

export type { AdminCheckboxFieldProps } from "./types";