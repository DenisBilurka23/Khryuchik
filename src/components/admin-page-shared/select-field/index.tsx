"use client";

import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

import type { AdminSelectFieldProps, AdminSelectOption } from "./types";

export const AdminSelectField = ({
  name,
  label,
  options,
  defaultValue,
  required = false,
  placeholder,
  noOptionsText,
  onValueChangeAction,
}: AdminSelectFieldProps) => {
  const [selected, setSelected] = useState<AdminSelectOption | null>(
    () => options.find((option) => option.code === defaultValue) ?? null,
  );

  return (
    <>
      <input type="hidden" name={name} value={selected?.code ?? ""} />
      <Autocomplete
        options={options}
        value={selected}
        onChange={(_event, next) => {
          setSelected(next);
          onValueChangeAction?.(next?.code ?? null);
        }}
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

export type { AdminSelectFieldProps, AdminSelectOption } from "./types";
