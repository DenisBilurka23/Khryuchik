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

  const [isOpen, setIsOpen] = useState(false);
  const hasJustMatched = useRef(false);

  return (
    <Autocomplete
      fullWidth
      autoHighlight
      autoSelect
      disablePortal
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

        hasJustMatched.current = !isOpen;
        setIsOpen(false);

        if (code !== value) {
          onChange(code);
        }
      }}
      slotProps={{ listbox: { sx: { maxHeight: 280 } } }}
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          label={label}
          error={error}
          helperText={helperText}
          slotProps={{
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
