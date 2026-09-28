"use client";

import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { updateRegionPreferenceClient } from "@/client-api/region";
import { isRegionCode } from "@/utils";
import { setClientRegion } from "@/utils/region/client";

import { HeaderSelect } from "../header-select";

import type { RegionSwitcherProps } from "./types";

export const RegionSwitcher = ({
  region,
  availableRegions,
  label,
  sx,
}: RegionSwitcherProps) => {
  const t = useTranslations("storefront");
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState(region);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSelectedRegion(region);
  }, [region]);

  const updateRegion = async (nextRegion: RegionSwitcherProps["region"]) => {
    if (nextRegion === selectedRegion || isPending) {
      return;
    }

    const previousRegion = selectedRegion;

    setSelectedRegion(nextRegion);

    try {
      const response = await updateRegionPreferenceClient(nextRegion);

      if (!response.ok) {
        console.error(`Failed to update region: ${response.status}`);
        setClientRegion(previousRegion);
        setSelectedRegion(previousRegion);
        return;
      }

      setClientRegion(nextRegion);

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);
      setClientRegion(previousRegion);
      setSelectedRegion(previousRegion);
    }
  };

  // A single active region leaves nothing to switch between, so hide the
  // control entirely rather than render a one-option dropdown.
  if (availableRegions.length <= 1) {
    return null;
  }

  return (
    <HeaderSelect
      value={selectedRegion}
      label={label ?? t("regionSwitcherLabel")}
      icon={
        <PublicOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
      }
      disabled={isPending}
      options={availableRegions.map((targetRegion) => ({
        value: targetRegion,
        label: t(`regions.${targetRegion}.label`),
        selectedLabel: t(`regions.${targetRegion}.short`),
      }))}
      onChangeAction={(value) => {
        if (isRegionCode(value) && availableRegions.includes(value)) {
          void updateRegion(value);
        }
      }}
      sx={sx}
    />
  );
};

export type { RegionSwitcherProps } from "./types";
