"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import {
  AdminCountrySelectField,
  AdminCurrencySelectField,
} from "@/components/admin-page-shared";
import { getCurrencyForCountry } from "@/utils";

import type { NewRegionFieldsProps } from "./types";

export const NewRegionFields = ({
  locale,
  excludeCodes,
}: NewRegionFieldsProps) => {
  const tLocalization = useTranslations("adminPage.localization");
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const prefillCurrency = countryCode
    ? getCurrencyForCountry(countryCode)
    : undefined;

  return (
    <>
      <AdminCountrySelectField
        name="code"
        label={tLocalization("fields.regionCode")}
        locale={locale}
        required
        placeholder={tLocalization("countryPlaceholder")}
        noOptionsText={tLocalization("countryNoOptions")}
        excludeCodes={excludeCodes}
        onValueChangeAction={setCountryCode}
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
