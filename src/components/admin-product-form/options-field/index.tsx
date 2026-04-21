"use client";

import { useState } from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";

import type { AdminOptionsFieldProps } from "./types";

const toOptionValue = (label: string) =>
  label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const AdminOptionsField = ({
  name,
  title,
  helperText,
  initialOptions,
  itemLabel,
}: AdminOptionsFieldProps) => {
  const [options, setOptions] = useState(initialOptions);
  const [draftValue, setDraftValue] = useState("");

  const commitDraftValue = () => {
    const label = draftValue.trim();

    if (!label) {
      return;
    }

    const value = toOptionValue(label);

    setOptions((currentOptions) => {
      if (currentOptions.some((option) => option.value === value || option.label.toLowerCase() === label.toLowerCase())) {
        return currentOptions;
      }

      return [...currentOptions, { label, value }];
    });

    setDraftValue("");
  };

  return (
    <Stack gap={1.5}>
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(
          options
            .map((option) => ({
              label: option.label.trim(),
              value: option.value.trim() || toOptionValue(option.label),
            }))
            .filter((option) => option.label && option.value),
        )}
      />
      <Stack gap={0.75}>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 18, color: "text.primary" }}>
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
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            '&:focus-within': {
              borderColor: "#D96C82",
              boxShadow: "0 0 0 3px rgba(217,108,130,0.12)",
            },
          }}
        >
          {options.map((option) => (
            <Chip
              key={`${name}-${option.value}`}
              label={option.label}
              onDelete={() => {
                setOptions((currentOptions) => currentOptions.filter((item) => item.value !== option.value));
              }}
              sx={{ borderRadius: "999px", fontWeight: 600, bgcolor: "#FFF4F6" }}
            />
          ))}
          <Box
            component="input"
            value={draftValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDraftValue(event.target.value);
            }}
            onBlur={commitDraftValue}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                commitDraftValue();
              }
            }}
            placeholder={options.length === 0 ? itemLabel : ""}
            aria-label={itemLabel}
            sx={{
              flex: 1,
              minWidth: 140,
              border: 0,
              outline: 0,
              bgcolor: "transparent",
              font: "inherit",
              color: "inherit",
              p: 0,
              m: 0,
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {helperText}
        </Typography>
      </Stack>
    </Stack>
  );
};

export type { AdminOptionsFieldProps } from "./types";