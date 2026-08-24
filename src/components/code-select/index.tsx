import { useMemo, useRef, useState } from "react";
import { Autocomplete, createFilterOptions, TextField } from "@mui/material";

import type { CodeOption, CodeSelectProps } from "./types";

export const CodeSelect = ({
  value,
  options,
  label,
  onChange,
  required,
  error,
  helperText,
  aliasesOf,
  inputName,
  autoComplete,
}: CodeSelectProps) => {
  // Search covers the visible label, the code, and whatever aliases the caller
  // adds - so a name typed in another language still finds its option.
  const filterOptions = useMemo(
    () =>
      createFilterOptions<CodeOption>({
        stringify: (option) =>
          [option.label, option.code, ...(aliasesOf?.(option) ?? [])].join(" "),
      }),
    [aliasesOf],
  );

  const codeByName = useMemo(() => {
    const names = new Map<string, string>();

    for (const option of options) {
      names.set(option.label.toLowerCase(), option.code);
      names.set(option.code.toLowerCase(), option.code);

      for (const alias of aliasesOf?.(option) ?? []) {
        names.set(alias.toLowerCase(), option.code);
      }
    }

    return names;
  }, [options, aliasesOf]);

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
              name: inputName,
              autoComplete,
            },
          }}
        />
      )}
    />
  );
};

export type { CodeOption, CodeSelectProps } from "./types";
