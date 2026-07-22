"use client";

import { useMemo } from "react";

import { getAllCountriesSorted } from "@/utils";

import { AdminSelectField } from "../select-field";

import type { AdminCountrySelectFieldProps } from "./types";

export const AdminCountrySelectField = ({
  locale,
  excludeCodes,
  ...fieldProps
}: AdminCountrySelectFieldProps) => {
  const options = useMemo(() => {
    const excluded = new Set(excludeCodes);

    return getAllCountriesSorted(locale)
      .filter((country) => !excluded.has(country.code))
      .map((country) => ({
        code: country.code,
        label: `${country.code} — ${country.label}`,
      }));
  }, [locale, excludeCodes]);

  return <AdminSelectField options={options} {...fieldProps} />;
};

export type { AdminCountrySelectFieldProps } from "./types";
