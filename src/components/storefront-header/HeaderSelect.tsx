"use client";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";

import type { HeaderSelectProps } from "./types";

export const HeaderSelect = ({
  value,
  label,
  options,
  onChange,
  icon,
  disabled = false,
  sx,
}: HeaderSelectProps) => {
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  return (
    <Select
      value={value}
      size="small"
      variant="outlined"
      displayEmpty
      disabled={disabled}
      inputProps={{ "aria-label": label }}
      IconComponent={KeyboardArrowDownRoundedIcon}
      renderValue={() => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            component="span"
            sx={{ display: "inline-flex", alignItems: "center", lineHeight: 0 }}
          >
            {icon}
          </Box>
          <Typography
            component="span"
            sx={{ fontSize: 15, fontWeight: 700, color: "text.primary" }}
          >
            {selectedOption?.label ?? value}
          </Typography>
        </Stack>
      )}
      onChange={(event) => onChange(event.target.value)}
      sx={{
        minWidth: 96,
        height: 40,
        borderRadius: "999px",
        bgcolor: "#fff",
        boxShadow: "0 1px 3px rgba(54, 33, 18, 0.04)",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#E8D6BF",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#D96C82",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#D96C82",
        },
        "& .MuiSelect-select": {
          py: "9px",
          pl: 1.5,
          pr: 4,
          display: "flex",
          alignItems: "center",
        },
        "& .MuiSelect-icon": {
          right: 10,
          color: "text.secondary",
        },
        ...sx,
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};