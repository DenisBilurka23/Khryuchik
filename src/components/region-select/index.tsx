import { useMemo } from "react";

import { CodeSelect } from "@/components/code-select";
import { COUNTRY_SUBDIVISIONS } from "@/constants/country-subdivisions";

import type { RegionSelectProps } from "./types";

export const getRegionOptions = (country: string) =>
  COUNTRY_SUBDIVISIONS[country.toUpperCase()];

export const RegionSelect = ({ country, ...props }: RegionSelectProps) => {
  const options = useMemo(
    () =>
      (getRegionOptions(country) ?? []).map((subdivision) => ({
        code: subdivision.code,
        label: subdivision.name,
      })),
    [country],
  );

  return (
    <CodeSelect
      {...props}
      options={options}
      inputName="region"
      autoComplete="address-level1"
    />
  );
};

export type { RegionSelectProps } from "./types";
