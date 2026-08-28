"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { fetchPickupPointsClient } from "@/client-api/shipping";
import type { ShippingPickupPoint } from "@/types/shipping";
import { isPostalCodeValid } from "@/utils";

import type {
  UsePickupPointsParams,
  UsePickupPointsResult,
} from "./usePickupPoints.types";

type PointsState = {
  key: string;
  points: ShippingPickupPoint[];
};

export const usePickupPoints = ({
  address,
  isEnabled,
}: UsePickupPointsParams): UsePickupPointsResult => {
  const [result, setResult] = useState<PointsState | null>(null);

  const addressKey = useMemo(
    () =>
      address?.postalCode?.trim() && isPostalCodeValid(address.postalCode)
        ? [address.country, address.postalCode.trim(), address.line1 ?? ""]
            .join("|")
            .toUpperCase()
        : "",
    [address],
  );

  const requestKey = isEnabled && addressKey ? addressKey : "";
  const latestAddress = useRef(address);
  const requestedKey = useRef("");

  useEffect(() => {
    latestAddress.current = address;
  });

  useEffect(() => {
    if (!requestKey || requestedKey.current === requestKey) {
      return;
    }

    const currentAddress = latestAddress.current;

    if (!currentAddress) {
      return;
    }

    requestedKey.current = requestKey;

    void (async () => {
      try {
        const response = await fetchPickupPointsClient({
          address: currentAddress,
        });

        if (requestedKey.current !== requestKey) {
          return;
        }

        setResult({ key: requestKey, points: response.data?.points ?? [] });
      } catch (error) {
        console.error("Pickup point lookup failed", error);
        setResult({ key: requestKey, points: [] });
      }
    })();
  }, [requestKey]);

  if (!requestKey) {
    return { status: "idle", points: [] };
  }

  if (result?.key !== requestKey) {
    return { status: "loading", points: [] };
  }

  return {
    status: result.points.length > 0 ? "ok" : "empty",
    points: result.points,
  };
};
