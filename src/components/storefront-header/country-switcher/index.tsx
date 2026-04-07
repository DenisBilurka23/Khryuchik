"use client";

import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateCountryPreferenceClient } from "@/client-api/country";
import { setClientCountry } from "@/utils/country/client";
import { countries, countryLabels } from "@/utils";

import { HeaderSelect } from "../header-select";

import type { CountrySwitcherProps } from "./types";

export const CountrySwitcher = ({
  country,
  locale,
  label,
  sx,
}: CountrySwitcherProps) => {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState(country);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSelectedCountry(country);
  }, [country]);

  const updateCountry = async (nextCountry: CountrySwitcherProps["country"]) => {
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

  return (
    <HeaderSelect
      value={selectedCountry}
      label={label}
      icon={<PublicOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />}
      disabled={isPending}
      options={countries.map((targetCountry) => ({
        value: targetCountry,
        label: countryLabels[locale][targetCountry],
      }))}
      onChange={(value) => {
        if (value === "BY" || value === "US") {
          void updateCountry(value);
        }
      }}
      sx={sx}
    />
  );
};

export type { CountrySwitcherProps } from "./types";