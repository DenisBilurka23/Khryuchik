"use client";

import { useState } from "react";
import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";

import { BOOK_FORMAT } from "@/constants/catalog";

import type { AdminFormatsFieldProps } from "./types";

export const AdminFormatsField = ({
  name,
  title,
  helperText,
  printedLabel,
  digitalLabel,
  initialFormats,
}: AdminFormatsFieldProps) => {
  const initial = new Set(initialFormats.map((f) => f.value));
  const [printed, setPrinted] = useState(initial.has(BOOK_FORMAT.printed));
  const [digital, setDigital] = useState(initial.has(BOOK_FORMAT.digital));

  const selectedOptions = [
    ...(printed ? [{ label: printedLabel, value: BOOK_FORMAT.printed }] : []),
    ...(digital ? [{ label: digitalLabel, value: BOOK_FORMAT.digital }] : []),
  ];

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
    </Stack>
  );
};

export type { AdminFormatsFieldProps } from "./types";
