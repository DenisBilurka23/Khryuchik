"use client";

import { useMemo, useState } from "react";

import { AdminProductAutocompleteField } from "@/components/admin-page-shared";
import { useProductSearch } from "@/hooks/useProductSearch";
import type { AdminProductOption } from "@/types/admin";

import type { AdminSingleProductFieldProps } from "./types";

const mergeOptions = (...groups: AdminProductOption[][]) => {
  const seen = new Set<string>();

  return groups.flat().filter((option) => {
    if (seen.has(option.id)) {
      return false;
    }

    seen.add(option.id);
    return true;
  });
};

export const AdminSingleProductField = ({
  name,
  label,
  placeholder,
  helperText,
  locale,
  initialOption,
  initialOptions,
}: AdminSingleProductFieldProps) => {
  const [selectedOption, setSelectedOption] = useState<AdminProductOption | null>(
    initialOption ?? null,
  );
  const [inputValue, setInputValue] = useState("");

  const fallbackOptions = useMemo(
    () => mergeOptions(selectedOption ? [selectedOption] : [], initialOptions),
    [initialOptions, selectedOption],
  );

  const { options: searchOptions, isLoading } = useProductSearch({
    locale,
    query: inputValue,
    excludeProductId: "",
    fallbackOptions,
  });

  const options = useMemo(
    () => mergeOptions(fallbackOptions, searchOptions),
    [fallbackOptions, searchOptions],
  );

  return (
    <>
      <input type="hidden" name={name} value={selectedOption?.id ?? ""} />
      <AdminProductAutocompleteField
        options={options}
        value={selectedOption}
        inputValue={inputValue}
        loading={isLoading}
        label={label}
        placeholder={placeholder}
        helperText={helperText}
        onChangeAction={(_, value) => {
          setSelectedOption(Array.isArray(value) ? null : value);
        }}
        onInputChangeAction={(_, value) => {
          setInputValue(value);
        }}
      />
    </>
  );
};

export type { AdminSingleProductFieldProps } from "./types";
