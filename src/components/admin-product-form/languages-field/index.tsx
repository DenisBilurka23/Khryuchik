"use client";

import { useState } from "react";
import {
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";

import type { ProductPrintedStock } from "@/types/catalog";
import type { ShippingHubCode } from "@/types/shipping";
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
  stockName,
  stockTitle,
  stockHelperText,
  stockEmptyText,
  hubs,
  initialStock,
}: AdminLanguagesFieldProps) => {
  const initialSelected = new Set(initialOptions.map((o) => o.value));
  const [selected, setSelected] = useState<Set<string>>(initialSelected);
  const [stock, setStock] = useState<ProductPrintedStock>(initialStock);

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

  const toggleHub = (code: string, hub: ShippingHubCode) => {
    setStock((prev) => {
      const current = prev[code] ?? [];

      return {
        ...prev,
        [code]: current.includes(hub)
          ? current.filter((entry) => entry !== hub)
          : [...current, hub],
      };
    });
  };

  const selectedOptions = availableLocales
    .filter((locale) => selected.has(locale.code))
    .map((locale) => localeToOption(locale.code, adminLocale));

  // A language that was unticked keeps no stock: the warehouse cannot hold an
  // edition the book no longer comes in.
  const postedStock = Object.fromEntries(
    selectedOptions
      .map((option) => [option.value, stock[option.value] ?? []] as const)
      .filter(([, hubCodes]) => hubCodes.length > 0),
  );

  return (
    <Stack gap={1.5}>
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(selectedOptions)}
      />
      <input type="hidden" name={stockName} value={JSON.stringify(postedStock)} />
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

      <Stack gap={1}>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 18, color: "text.primary" }}>
          {stockTitle}
        </Typography>

        {selectedOptions.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {stockEmptyText}
          </Typography>
        ) : (
          selectedOptions.map((option) => (
            <Stack
              key={`${stockName}-${option.value}`}
              gap={0.5}
              sx={{
                p: 1.5,
                borderRadius: "18px",
                border: "1px solid #F0DFC8",
                bgcolor: "#fff",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {option.label}
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} gap={{ xs: 0, sm: 2 }}>
                {hubs.map((hub) => (
                  <FormControlLabel
                    key={`${stockName}-${option.value}-${hub.code}`}
                    control={
                      <Checkbox
                        checked={Boolean(stock[option.value]?.includes(hub.code))}
                        onChange={() => toggleHub(option.value, hub.code)}
                      />
                    }
                    label={hub.label}
                  />
                ))}
              </Stack>
            </Stack>
          ))
        )}

        <Typography variant="body2" color="text.secondary">
          {stockHelperText}
        </Typography>
      </Stack>
    </Stack>
  );
};

export type { AdminLanguagesFieldProps } from "./types";
