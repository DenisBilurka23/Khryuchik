"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { confirmAccountOrderDeliveryClient } from "@/client-api/account";

import type {
  UseOrderDeliveryConfirmationParams,
  UseOrderDeliveryConfirmationResult,
} from "./useOrderDeliveryConfirmation.types";

export type {
  UseOrderDeliveryConfirmationParams,
  UseOrderDeliveryConfirmationResult,
} from "./useOrderDeliveryConfirmation.types";

export const useOrderDeliveryConfirmation = ({
  orderId,
}: UseOrderDeliveryConfirmationParams): UseOrderDeliveryConfirmationResult => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const openDialog = () => {
    setHasError(false);
    setIsOpen(true);
  };

  const closeDialog = () => {
    if (isSubmitting) {
      return;
    }

    setIsOpen(false);
  };

  const confirmDelivery = async () => {
    setIsSubmitting(true);

    const response = await confirmAccountOrderDeliveryClient(orderId);

    setIsSubmitting(false);
    setHasError(!response.ok);
    setIsOpen(false);

    if (response.ok) {
      router.refresh();
    }
  };

  return {
    isOpen,
    isSubmitting,
    hasError,
    openDialog,
    closeDialog,
    confirmDelivery,
  };
};
