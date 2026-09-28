"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import {
  AdminCurrencySelectField,
  AdminSelectField,
} from "@/components/admin-page-shared";
import { REGION_DEFAULT_CURRENCY } from "@/constants/region";
import { isRegionCode } from "@/utils";

import type { NewRegionFieldsProps } from "./types";

export const NewRegionFields = ({
  locale,
  regionCodes,
}: NewRegionFieldsProps) => {
  const tLocalization = useTranslations("adminPage.localization");
  const tShared = useTranslations("adminPage.shared");
  const [regionCode, setRegionCode] = useState<string | null>(null);
  const prefillCurrency = isRegionCode(regionCode)
    ? REGION_DEFAULT_CURRENCY[regionCode]
    : undefined;

  return (
    <>
      <AdminSelectField
        name="code"
        label={tLocalization("fields.regionCode")}
        required
        placeholder={tLocalization("regionPlaceholder")}
        noOptionsText={tLocalization("regionNoOptions")}
        options={regionCodes.map((code) => ({
          code,
          label: tShared(`regions.${code}`),
        }))}
        onValueChangeAction={setRegionCode}
      />
      <AdminCurrencySelectField
        key={prefillCurrency ?? "none"}
        name="currency"
        label={tLocalization("fields.currency")}
        locale={locale}
        required
        defaultValue={prefillCurrency}
        placeholder={tLocalization("currencyPlaceholder")}
        noOptionsText={tLocalization("currencyNoOptions")}
      />
    </>
  );
};

export type { NewRegionFieldsProps } from "./types";
