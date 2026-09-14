"use client";

import { useCallback, useState } from "react";

import { validatePromoCodeClient } from "@/client-api/promo";
import {
  clearStoredPromo,
  setStoredPromo,
  useStoredPromo,
} from "@/components/cart/promo-store";
import { calculatePromoDiscount, normalizePromoCode } from "@/utils";

import type {
  PromoCodeStatus,
  UsePromoCodeParams,
  UsePromoCodeResult,
} from "./usePromoCode.types";

export const usePromoCode = ({
  subtotal,
}: UsePromoCodeParams): UsePromoCodeResult => {
  const appliedPromo = useStoredPromo();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<PromoCodeStatus>("idle");

  const applyCode = useCallback(() => {
    const normalizedCode = normalizePromoCode(code);

    if (normalizedCode.length === 0) {
      return;
    }

    const validate = async () => {
      setStatus("loading");

      const response = await validatePromoCodeClient(normalizedCode);

      if (!response.ok || !response.data) {
        setStatus("error");
        return;
      }

      const validation = response.data;

      if (validation.status !== "ok") {
        clearStoredPromo();
        setStatus(validation.status);
        return;
      }

      setStoredPromo({
        code: validation.code,
        percentOff: validation.percentOff,
      });
      setStatus("applied");
    };

    void validate();
  }, [code]);

  const removeCode = useCallback(() => {
    clearStoredPromo();
    setCode("");
    setStatus("idle");
  }, []);

  return {
    code,
    appliedPromo,
    discount: appliedPromo
      ? calculatePromoDiscount(appliedPromo.percentOff, subtotal)
      : 0,
    status,
    setCode,
    applyCode,
    removeCode,
  };
};
