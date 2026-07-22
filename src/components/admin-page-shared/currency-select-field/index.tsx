"use client";

import { useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

import { getAllCurrenciesSorted } from "@/utils";

import type { AdminCurrencySelectFieldProps } from "./types";

export const AdminCurrencySelectField = ({
  name,
  label,
  locale,
  defaultValue,
  required = false,
  placeholder,
  noOptionsText,
}: AdminCurrencySelectFieldProps) => {
  const options = useMemo(() => getAllCurrenciesSorted(locale), [locale]);
  const [selected, setSelected] = useState(
    () => options.find((option) => option.code === defaultValue) ?? null,
  );

  return (
    <>
      <input type="hidden" name={name} value={selected?.code ?? ""} />
      <Autocomplete
        options={options}
        value={selected}
        onChange={(_event, next) => setSelected(next)}
        isOptionEqualToValue={(option, value) => option.code === value.code}
        getOptionLabel={(option) => option.label}
        noOptionsText={noOptionsText}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              border: "1px solid #EED9C2",
              backgroundImage: "none",
            },
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            required={required}
          />
        )}
      />
    </>
  );
};

export type { AdminCurrencySelectFieldProps } from "./types";
