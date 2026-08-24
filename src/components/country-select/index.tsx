import { useCallback } from "react";

import { CodeSelect } from "@/components/code-select";
import { getCountryDisplayName } from "@/utils";

import type { CountryOption, CountrySelectProps } from "./types";

export const CountrySelect = (props: CountrySelectProps) => {
  const aliasesOf = useCallback(
    (option: CountryOption) => [getCountryDisplayName("en", option.code)],
    [],
  );

  return (
    <CodeSelect
      {...props}
      aliasesOf={aliasesOf}
      inputName="country"
      autoComplete="country-name"
    />
  );
};

export type { CountryOption, CountrySelectProps } from "./types";
