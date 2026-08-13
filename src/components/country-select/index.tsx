import { useMemo, useRef, useState } from "react";
import { Autocomplete, createFilterOptions, TextField } from "@mui/material";

import { getCountryDisplayName } from "@/utils";

import type { CountryOption, CountrySelectProps } from "./types";

// The list is labelled in the page language, but the country is often typed in
// English regardless — and the browser fills English names into a Russian page.
// Search covers the localized name, the English one and the ISO code alike.
const filterOptions = createFilterOptions<CountryOption>({
  stringify: (option) =>
    `${option.label} ${getCountryDisplayName("en", option.code)} ${option.code}`,
});

export const CountrySelect = ({
  value,
  options,
  label,
  onChange,
  required,
  error,
  helperText,
}: CountrySelectProps) => {
  const codeByName = useMemo(() => {
    const names = new Map<string, string>();

    for (const option of options) {
      names.set(option.label.toLowerCase(), option.code);
      names.set(option.code.toLowerCase(), option.code);
      names.set(
        getCountryDisplayName("en", option.code).toLowerCase(),
        option.code,
      );
    }

    return names;
  }, [options]);

  // MUI opens the listbox on every input event, right after our handler runs.
  // On a filled-in name that leaves it hanging open with no way back: closing
  // needs a blur, and a field the user never focused never blurs.
  const [isOpen, setIsOpen] = useState(false);
  const hasJustMatched = useRef(false);

  return (
    <Autocomplete
      fullWidth
      autoHighlight
      autoSelect
      disablePortal
      // Emptying the input would otherwise drop the selection, so retyping a
      // country and matching nothing leaves the field blank. Kept, the previous
      // country comes back on blur.
      disableClearable={required}
      open={isOpen}
      onOpen={() => {
        if (hasJustMatched.current) {
          hasJustMatched.current = false;

          return;
        }

        setIsOpen(true);
      }}
      onClose={() => setIsOpen(false)}
      options={options}
      filterOptions={filterOptions}
      value={options.find((option) => option.code === value) ?? null}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, selected) => option.code === selected.code}
      onChange={(_, option) => onChange(option?.code ?? "")}
      onInputChange={(_, input, reason) => {
        if (reason !== "input") {
          return;
        }

        const code = codeByName.get(input.trim().toLowerCase());

        if (!code) {
          return;
        }

        // Only an already-closed listbox is about to be opened by MUI; when it
        // is open the open call bails out on its own and needs no suppressing.
        hasJustMatched.current = !isOpen;
        setIsOpen(false);

        if (code !== value) {
          onChange(code);
        }
      }}
      slotProps={{ paper: { sx: { maxHeight: 280 } } }}
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          label={label}
          error={error}
          helperText={helperText}
          slotProps={{
            // MUI pins autoComplete to "off" so the browser's own dropdown
            // cannot cover its listbox, which also stops autofill reaching the
            // field. Put the hint back.
            htmlInput: {
              ...params.inputProps,
              name: "country",
              autoComplete: "country-name",
            },
          }}
        />
      )}
    />
  );
};

export type { CountryOption, CountrySelectProps } from "./types";
