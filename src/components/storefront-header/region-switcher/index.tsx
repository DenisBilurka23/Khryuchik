"use client";

import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { useEffect, useOptimistic, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { updateRegionPreferenceClient } from "@/client-api/region";
import { setRegionSwitching } from "@/stores/region-switch";
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
  const [displayedRegion, setDisplayedRegion] = useOptimistic(region);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isPending) {
      return;
    }

    setRegionSwitching(true);

    return () => {
      setRegionSwitching(false);
    };
  }, [isPending]);

  const updateRegion = (nextRegion: RegionSwitcherProps["region"]) => {
    if (nextRegion === region || isPending) {
      return;
    }

    startTransition(async () => {
      setDisplayedRegion(nextRegion);

      try {
        const response = await updateRegionPreferenceClient(nextRegion);

        if (!response.ok || !response.data) {
          console.error(`Failed to update region: ${response.status}`);
          return;
        }

        setClientRegion(response.data.region);

        startTransition(() => {
          router.refresh();
        });
      } catch (error) {
        console.error(error);
      }
    });
  };

  if (availableRegions.length <= 1) {
    return null;
  }

  return (
    <HeaderSelect
      value={displayedRegion}
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
          updateRegion(value);
        }
      }}
      sx={sx}
    />
  );
};

export type { RegionSwitcherProps } from "./types";
