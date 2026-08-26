"use client";

import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";

import type { AdminFormatsFieldProps } from "./types";

export const AdminFormatsField = ({
  name,
  title,
  helperText,
  options,
  selectedOptions,
  isFormatSelected,
  onToggleAction,
}: AdminFormatsFieldProps) => (
  <Stack gap={1.5}>
    <input type="hidden" name={name} value={JSON.stringify(selectedOptions)} />
    <Typography
      variant="h6"
      sx={{ fontWeight: 800, fontSize: 18, color: "text.primary" }}
    >
      {title}
    </Typography>
    <Stack direction="row" gap={3} flexWrap="wrap">
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          control={
            <Checkbox
              checked={isFormatSelected(option.value)}
              onChange={() => onToggleAction(option.value)}
            />
          }
          label={option.label}
        />
      ))}
    </Stack>
    <Typography variant="body2" color="text.secondary">
      {helperText}
    </Typography>
  </Stack>
);

export type { AdminFormatsFieldProps } from "./types";
