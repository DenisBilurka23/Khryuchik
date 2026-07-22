"use client";

import { useMemo } from "react";

import { getAllCurrenciesSorted } from "@/utils";

import { AdminSelectField } from "../select-field";

import type { AdminCurrencySelectFieldProps } from "./types";

export const AdminCurrencySelectField = ({
  locale,
  ...fieldProps
}: AdminCurrencySelectFieldProps) => {
  const options = useMemo(() => getAllCurrenciesSorted(locale), [locale]);

  return <AdminSelectField options={options} {...fieldProps} />;
};

export type { AdminCurrencySelectFieldProps } from "./types";
