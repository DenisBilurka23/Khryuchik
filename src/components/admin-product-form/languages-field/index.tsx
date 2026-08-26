"use client";

import { Box, Chip, Stack, Typography } from "@mui/material";

import type { AdminLanguagesFieldProps } from "./types";

export const AdminLanguagesField = ({
  name,
  title,
  helperText,
  options,
  selectedOptions,
  isLanguageSelected,
  onToggleAction,
}: AdminLanguagesFieldProps) => (
  <Stack gap={0.75}>
    <input type="hidden" name={name} value={JSON.stringify(selectedOptions)} />
    <Typography
      variant="h6"
      sx={{ fontWeight: 800, fontSize: 18, color: "text.primary" }}
    >
      {title}
    </Typography>
    <Box
      sx={{
        border: "1px solid #D9D3C7",
        borderRadius: "18px",
        minHeight: 72,
        px: 1.5,
        py: 1.25,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        bgcolor: "#fff",
      }}
    >
      {options.map((option) => {
        const isSelected = isLanguageSelected(option.value);

        return (
          <Chip
            key={option.value}
            label={option.label}
            onClick={() => onToggleAction(option.value)}
            variant={isSelected ? "filled" : "outlined"}
            sx={{
              borderRadius: "999px",
              fontWeight: 600,
              cursor: "pointer",
              bgcolor: isSelected ? "#FFF4F6" : "transparent",
              borderColor: isSelected ? "#D96C82" : "#D9D3C7",
              color: isSelected ? "#D96C82" : "text.secondary",
              "& .MuiChip-label": { px: 1.5 },
            }}
          />
        );
      })}
    </Box>
    <Typography variant="body2" color="text.secondary">
      {helperText}
    </Typography>
  </Stack>
);

export type { AdminLanguagesFieldProps } from "./types";
