"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { updateRegionPreferenceClient } from "@/client-api/region";
import { getAddressRegion, type RegionCode } from "@/utils";
import { setClientRegion } from "@/utils/region/client";

import type {
  UseCheckoutRegionSyncParams,
  UseCheckoutRegionSyncResult,
} from "./useCheckoutRegionSync.types";

export const useCheckoutRegionSync = ({
  region,
  country,
  availableRegions,
}: UseCheckoutRegionSyncParams): UseCheckoutRegionSyncResult => {
  const router = useRouter();
  const [switchedRegion, setSwitchedRegion] = useState<RegionCode | null>(null);
  const [isRefreshing, startTransition] = useTransition();
  const requestedRegion = useRef<RegionCode | null>(null);
  const addressRegion = getAddressRegion(country, availableRegions);
  const targetRegion =
    addressRegion && addressRegion !== region ? addressRegion : null;

  useEffect(() => {
    if (!targetRegion) {
      requestedRegion.current = null;
      return;
    }

    if (requestedRegion.current === targetRegion) {
      return;
    }

    requestedRegion.current = targetRegion;

    const switchRegion = async () => {
      try {
        const response = await updateRegionPreferenceClient(targetRegion);

        if (!response.ok) {
          console.error(`Failed to update region: ${response.status}`);
          return;
        }

        setClientRegion(targetRegion);
        setSwitchedRegion(targetRegion);
        startTransition(() => {
          router.refresh();
        });
      } catch (error) {
        console.error(error);
      }
    };

    void switchRegion();
  }, [targetRegion, router]);

  return {
    isSwitching: Boolean(targetRegion) || isRefreshing,
    switchedRegion,
  };
};
