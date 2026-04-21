import type { ReactElement } from "react";
import { Box, Typography } from "@mui/material";

type AdminCheckboxFieldProps = {
  control: ReactElement;
  label: string;
};

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