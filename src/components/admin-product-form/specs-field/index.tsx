"use client";

import { useState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";

import type { AdminSpecsFieldProps } from "./types";

export const AdminSpecsField = ({
  name,
  title,
  helperText,
  initialSpecs,
  labelTitle,
  valueTitle,
  addButtonLabel,
  removeButtonLabel,
}: AdminSpecsFieldProps) => {
  const [specs, setSpecs] = useState(
    initialSpecs.length > 0 ? initialSpecs : [{ label: "", value: "" }],
  );

  return (
    <Stack gap={1.5}>
      <input type="hidden" name={name} value={JSON.stringify(specs.filter((spec) => spec.label.trim() && spec.value.trim()))} />
      <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 18, color: "text.primary" }}>
        {title}
      </Typography>
      <Box component="p" sx={{ m: 0, color: "text.secondary", fontSize: 14 }}>
        {helperText}
      </Box>
      <Stack gap={1.5}>
        {specs.map((spec, index) => (
          <Paper key={`${name}-${index}`} variant="outlined" sx={{ p: 1.5, borderRadius: "18px" }}>
            <Stack gap={1.5}>
              <TextField
                label={labelTitle}
                value={spec.label}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setSpecs((currentSpecs) => currentSpecs.map((item, itemIndex) => (
                    itemIndex === index ? { ...item, label: nextValue } : item
                  )));
                }}
                fullWidth
              />
              <TextField
                label={valueTitle}
                value={spec.value}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setSpecs((currentSpecs) => currentSpecs.map((item, itemIndex) => (
                    itemIndex === index ? { ...item, value: nextValue } : item
                  )));
                }}
                fullWidth
              />
              <Button
                type="button"
                variant="text"
                color="inherit"
                sx={{ alignSelf: "flex-start" }}
                onClick={() => {
                  setSpecs((currentSpecs) => currentSpecs.length > 1
                    ? currentSpecs.filter((_, itemIndex) => itemIndex !== index)
                    : [{ label: "", value: "" }]);
                }}
              >
                {removeButtonLabel}
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>
      <Button
        type="button"
        variant="outlined"
        sx={{ alignSelf: "flex-start" }}
        onClick={() => {
          setSpecs((currentSpecs) => [...currentSpecs, { label: "", value: "" }]);
        }}
      >
        {addButtonLabel}
      </Button>
    </Stack>
  );
};

export type { AdminSpecsFieldProps } from "./types";