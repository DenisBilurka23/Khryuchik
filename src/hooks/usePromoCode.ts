"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { validatePromoCodeClient } from "@/client-api/promo";
import {
  clearStoredPromo,
  setStoredPromo,
  useStoredPromo,
} from "@/components/cart/promo-store";
import type { OrderPromoCode } from "@/types/order";
import { calculatePromoDiscount, normalizePromoCode } from "@/utils";

import type {
  PromoCodeStatus,
  UsePromoCodeParams,
  UsePromoCodeResult,
} from "./usePromoCode.types";

export const usePromoCode = ({
  subtotal,
  isPersistent = true,
}: UsePromoCodeParams): UsePromoCodeResult => {
  const { status: sessionStatus } = useSession();
  const isGuest = sessionStatus === "unauthenticated";
  const storedPromo = useStoredPromo();
  const [sessionPromo, setSessionPromo] = useState<OrderPromoCode | null>(null);
  const activePromo = isPersistent ? storedPromo : sessionPromo;
  const appliedPromo = isGuest ? null : activePromo;
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<PromoCodeStatus>("idle");

  useEffect(() => {
    if (isGuest && storedPromo) {
      clearStoredPromo();
    }
  }, [isGuest, storedPromo]);

  const dropPromo = useCallback(() => {
    if (isPersistent) {
      clearStoredPromo();
      return;
    }

    setSessionPromo(null);
  }, [isPersistent]);

  const savePromo = useCallback(
    (promo: OrderPromoCode) => {
      if (isPersistent) {
        setStoredPromo(promo);
        return;
      }

      setSessionPromo(promo);
    },
    [isPersistent],
  );

  const applyCode = useCallback(() => {
    if (sessionStatus === "loading") {
      return;
    }

    const normalizedCode = normalizePromoCode(code);

    if (normalizedCode.length === 0) {
      return;
    }

    if (isGuest) {
      setStatus("unauthorized");
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
        dropPromo();
        setStatus(validation.status);
        return;
      }

      savePromo({
        code: validation.code,
        percentOff: validation.percentOff,
      });
      setStatus("applied");
    };

    void validate();
  }, [code, dropPromo, isGuest, savePromo, sessionStatus]);

  const removeCode = useCallback(() => {
    dropPromo();
    setCode("");
    setStatus("idle");
  }, [dropPromo]);

  return {
    code,
    appliedPromo,
    discount: appliedPromo
      ? calculatePromoDiscount(appliedPromo.percentOff, subtotal)
      : 0,
    status,
    isGuest,
    setCode,
    applyCode,
    removeCode,
  };
};
