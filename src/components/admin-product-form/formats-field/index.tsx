"use client";

import { useState } from "react";
import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";

import { BOOK_FORMAT } from "@/constants/catalog";
import type { ProductOptionPriceDelta } from "@/types/product-details";

import { AdminOptionPriceDeltaField } from "../option-price-delta-field";
import type { AdminFormatsFieldProps } from "./types";

type FormatPriceDeltas = Partial<Record<string, ProductOptionPriceDelta>>;

export const AdminFormatsField = ({
  name,
  title,
  helperText,
  priceDeltaHelperText,
  printedLabel,
  digitalLabel,
  initialFormats,
  regions,
}: AdminFormatsFieldProps) => {
  const initial = new Set(initialFormats.map((f) => f.value));
  const [printed, setPrinted] = useState(initial.has(BOOK_FORMAT.printed));
  const [digital, setDigital] = useState(initial.has(BOOK_FORMAT.digital));
  const [priceDeltas, setPriceDeltas] = useState<FormatPriceDeltas>(() =>
    Object.fromEntries(
      initialFormats.map((format) => [format.value, format.priceDelta]),
    ),
  );

  const formats = [
    { value: BOOK_FORMAT.printed, label: printedLabel, selected: printed },
    { value: BOOK_FORMAT.digital, label: digitalLabel, selected: digital },
  ];

  const selectedOptions = formats
    .filter((format) => format.selected)
    .map((format) => ({
      label: format.label,
      value: format.value,
      priceDelta: priceDeltas[format.value],
    }));

  return (
    <Stack gap={1.5}>
      <input type="hidden" name={name} value={JSON.stringify(selectedOptions)} />
      <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 18, color: "text.primary" }}>
        {title}
      </Typography>
      <Stack gap={0.5}>
        <FormControlLabel
          control={
            <Checkbox
              checked={printed}
              onChange={(e) => setPrinted(e.target.checked)}
            />
          }
          label={printedLabel}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={digital}
              onChange={(e) => setDigital(e.target.checked)}
            />
          }
          label={digitalLabel}
        />
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {helperText}
      </Typography>

      {regions.length > 0 && selectedOptions.length > 0 ? (
        <Stack gap={1}>
          {selectedOptions.map((option) => (
            <AdminOptionPriceDeltaField
              key={`${name}-${option.value}-delta`}
              label={option.label}
              regions={regions}
              priceDelta={option.priceDelta}
              onChangeAction={(priceDelta) => {
                setPriceDeltas((current) => ({
                  ...current,
                  [option.value]: priceDelta,
                }));
              }}
            />
          ))}
          <Typography variant="body2" color="text.secondary">
            {priceDeltaHelperText}
          </Typography>
        </Stack>
      ) : null}
    </Stack>
  );
};

export type { AdminFormatsFieldProps } from "./types";
