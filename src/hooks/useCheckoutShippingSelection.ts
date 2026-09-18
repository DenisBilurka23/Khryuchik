"use client";

import { useState } from "react";

import { resolvePickupGroupIds } from "@/components/checkout-page-view/utils";
import type { ShippingPickupPoint } from "@/types/shipping";

import type {
  UseCheckoutShippingSelectionParams,
  UseCheckoutShippingSelectionResult,
} from "./useCheckoutShippingSelection.types";

export const useCheckoutShippingSelection = ({
  groups,
  pickupPointRequiredMessage,
}: UseCheckoutShippingSelectionParams): UseCheckoutShippingSelectionResult => {
  const [selectedOptionIds, setSelectedOptionIds] = useState<
    Record<string, string>
  >({});
  const [selectedPickupPoints, setSelectedPickupPoints] = useState<
    Record<string, ShippingPickupPoint>
  >({});
  const [pickupPointError, setPickupPointError] = useState<string | null>(null);

  const pickupGroupIds = resolvePickupGroupIds(groups, selectedOptionIds);

  const selectOption = (groupId: string, optionId: string) => {
    setSelectedOptionIds((prev) => ({ ...prev, [groupId]: optionId }));
    setPickupPointError(null);
  };

  const selectPickupPoint = (groupId: string, point: ShippingPickupPoint) => {
    setSelectedPickupPoints((prev) => ({ ...prev, [groupId]: point }));
    setPickupPointError(null);
  };

  const validatePickupPoints = () => {
    const isComplete = pickupGroupIds.every(
      (groupId) => selectedPickupPoints[groupId],
    );

    setPickupPointError(isComplete ? null : pickupPointRequiredMessage);

    return isComplete;
  };

  const resolvePickupPointIds = () =>
    pickupGroupIds.length > 0
      ? Object.fromEntries(
          pickupGroupIds.map((groupId) => [
            groupId,
            selectedPickupPoints[groupId].id,
          ]),
        )
      : undefined;

  return {
    selectedOptionIds,
    selectedPickupPoints,
    pickupGroupIds,
    pickupPointError,
    selectOption,
    selectPickupPoint,
    validatePickupPoints,
    resolvePickupPointIds,
  };
};
