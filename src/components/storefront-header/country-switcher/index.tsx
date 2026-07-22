"use client";

import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { updateCountryPreferenceClient } from "@/client-api/country";
import { setClientCountry } from "@/utils/country/client";
import { getCountryDisplayName } from "@/utils";

import { HeaderSelect } from "../header-select";

import type { CountrySwitcherProps } from "./types";

export const CountrySwitcher = ({
  country,
  locale,
  availableCountries,
  label,
  sx,
}: CountrySwitcherProps) => {
  const t = useTranslations("storefront");
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState(country);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSelectedCountry(country);
  }, [country]);

  const updateCountry = async (
    nextCountry: CountrySwitcherProps["country"],
  ) => {
    if (nextCountry === selectedCountry || isPending) {
      return;
    }

    const previousCountry = selectedCountry;

    setSelectedCountry(nextCountry);

    try {
      const response = await updateCountryPreferenceClient(nextCountry);

      if (!response.ok) {
        console.error(`Failed to update country: ${response.status}`);
        setClientCountry(previousCountry);
        setSelectedCountry(previousCountry);
        return;
      }

      setClientCountry(nextCountry);

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);
      setClientCountry(previousCountry);
      setSelectedCountry(previousCountry);
    }
  };

  // A single active region leaves nothing to switch between, so hide the
  // control entirely rather than render a one-option dropdown.
  if (availableCountries.length <= 1) {
    return null;
  }

  return (
    <HeaderSelect
      value={selectedCountry}
      label={label ?? t("countrySwitcherLabel")}
      icon={
        <PublicOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
      }
      disabled={isPending}
      options={availableCountries.map((targetCountry) => ({
        value: targetCountry,
        label: getCountryDisplayName(locale, targetCountry),
        selectedLabel: targetCountry,
      }))}
      onChangeAction={(value) => {
        if (availableCountries.includes(value)) {
          void updateCountry(value);
        }
      }}
      sx={sx}
    />
  );
};

export type { CountrySwitcherProps } from "./types";
