"use client";

import { useState } from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";

import type { ProductOption } from "@/types/product-details";
import type { AdminLanguagesFieldProps } from "./types";

const localeToOption = (code: string, adminLocale: string): ProductOption => ({
  label: new Intl.DisplayNames([adminLocale], { type: "language" }).of(code) ?? code,
  value: code,
});

export const AdminLanguagesField = ({
  name,
  title,
  helperText,
  adminLocale,
  availableLocales,
  initialOptions,
}: AdminLanguagesFieldProps) => {
  const initialSelected = new Set(initialOptions.map((o) => o.value));
  const [selected, setSelected] = useState<Set<string>>(initialSelected);

  const toggle = (code: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const selectedOptions = availableLocales
    .filter((locale) => selected.has(locale.code))
    .map((locale) => localeToOption(locale.code, adminLocale));

  return (
    <Stack gap={1.5}>
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(selectedOptions)}
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
          }}
        >
          {availableLocales.map((locale) => {
            const isSelected = selected.has(locale.code);
            const label = new Intl.DisplayNames([adminLocale], { type: "language" }).of(locale.code) ?? locale.code;

            return (
              <Chip
                key={locale.code}
                label={label}
                onClick={() => toggle(locale.code)}
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
    </Stack>
  );
};

export type { AdminLanguagesFieldProps } from "./types";
