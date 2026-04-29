"use client";

import type { SyntheticEvent } from "react";

import {
  Autocomplete,
  Box,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { AdminProductOption } from "@/types/admin";

import type { AdminProductAutocompleteFieldProps } from "./types";

const getAutocompleteSlotProps = () => ({
  popper: {
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
    ],
  },
  paper: {
    sx: {
      borderRadius: "20px",
      border: "1px solid #EED9C2",
      boxShadow: "0 24px 60px rgba(39, 27, 20, 0.16), 0 10px 24px rgba(39, 27, 20, 0.10)",
      backgroundImage: "none",
    },
  },
});

const renderAutocompleteOption = (
  props: React.HTMLAttributes<HTMLLIElement> & { key: string },
  option: AdminProductOption,
) => (
  <Box component="li" {...props} key={option.id}>
    <Stack spacing={0.25} sx={{ py: 0.5 }}>
      <Typography sx={{ fontWeight: 700 }}>{option.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {option.id}
        {option.slug ? ` • ${option.slug}` : ""}
      </Typography>
    </Stack>
  </Box>
);

const isOptionEqualToValue = (option: AdminProductOption, value: AdminProductOption) =>
  option.id === value.id;

const getOptionLabel = (option: AdminProductOption) => option.title;

export const AdminProductAutocompleteField = ({
  label,
  placeholder,
  helperText,
  options,
  value,
  inputValue,
  loading,
  multiple = false,
  openOnFocus = false,
  filterSelectedOptions = false,
  onChange,
  onInputChange,
}: AdminProductAutocompleteFieldProps) => {
  const sharedProps = {
    options,
    inputValue,
    loading,
    isOptionEqualToValue,
    getOptionLabel,
    filterOptions: (currentOptions: AdminProductOption[]) => currentOptions,
    slotProps: getAutocompleteSlotProps(),
    renderOption: renderAutocompleteOption,
    renderInput: (params: Parameters<NonNullable<typeof Autocomplete>[0]["renderInput"]>[0]) => (
      <TextField
        {...params}
        label={label}
        placeholder={placeholder}
        helperText={helperText}
        fullWidth
      />
    ),
  };

  if (multiple) {
    return (
      <Autocomplete
        multiple
        openOnFocus={openOnFocus}
        filterSelectedOptions={filterSelectedOptions}
        options={options}
        value={Array.isArray(value) ? value : []}
        inputValue={inputValue}
        loading={loading}
        isOptionEqualToValue={isOptionEqualToValue}
        getOptionLabel={getOptionLabel}
        filterOptions={(currentOptions) => currentOptions}
        onChange={(event, nextValue) => {
          onChange(event as SyntheticEvent, nextValue);
        }}
        onInputChange={onInputChange}
        slotProps={getAutocompleteSlotProps()}
        renderValue={(currentValue, getItemProps) =>
          currentValue.map((option, index) => {
            const itemProps = getItemProps({ index });

            return (
              <Chip
                {...itemProps}
                key={option.id}
                label={option.title}
                sx={{ borderRadius: "999px", fontWeight: 600, bgcolor: "#FFF4F6" }}
              />
            );
          })
        }
        renderOption={renderAutocompleteOption}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={Array.isArray(value) && value.length === 0 ? placeholder : ""}
            helperText={helperText}
            fullWidth
          />
        )}
        sx={{
          "& .MuiOutlinedInput-root": {
            alignItems: "flex-start",
            py: 0.75,
          },
        }}
      />
    );
  }

  return (
    <Autocomplete
      {...sharedProps}
      value={!Array.isArray(value) ? value : null}
      onChange={(event, nextValue) => {
        onChange(event as SyntheticEvent, nextValue);
      }}
      onInputChange={onInputChange}
    />
  );
};

export type { AdminProductAutocompleteFieldProps } from "./types";