import type { SyntheticEvent } from "react";

import type { AdminProductOption } from "@/types/admin";

export type AdminProductAutocompleteFieldProps = {
  label: string;
  placeholder: string;
  helperText: string;
  options: AdminProductOption[];
  value: AdminProductOption | AdminProductOption[] | null;
  inputValue: string;
  loading: boolean;
  multiple?: boolean;
  openOnFocus?: boolean;
  filterSelectedOptions?: boolean;
  onChange: (
    event: SyntheticEvent,
    value: AdminProductOption | AdminProductOption[] | null,
  ) => void;
  onInputChange: (event: SyntheticEvent, value: string) => void;
};