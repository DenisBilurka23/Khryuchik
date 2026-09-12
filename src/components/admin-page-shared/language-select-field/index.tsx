"use client";

import { useMemo } from "react";

import { getAllLanguagesSorted } from "@/utils";

import { AdminSelectField } from "../select-field";

import type { AdminLanguageSelectFieldProps } from "./types";

export const AdminLanguageSelectField = ({
  locale,
  excludeCodes,
  ...fieldProps
}: AdminLanguageSelectFieldProps) => {
  const options = useMemo(() => {
    const excluded = new Set(excludeCodes);

    return getAllLanguagesSorted(locale).filter(
      (language) => !excluded.has(language.code),
    );
  }, [locale, excludeCodes]);

  return <AdminSelectField options={options} {...fieldProps} />;
};

export type { AdminLanguageSelectFieldProps } from "./types";
