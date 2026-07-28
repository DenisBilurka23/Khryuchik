"use client";

import { useEffect, useRef, useState } from "react";

import { verifyEmailClient } from "@/client-api/auth";
import { EmailVerificationErrorReason } from "@/types/auth";

import type {
  EmailVerificationStatus,
  UseEmailVerificationInput,
} from "./useEmailVerification.types";

export const useEmailVerification = ({
  token,
  locale,
}: UseEmailVerificationInput): EmailVerificationStatus => {
  const [status, setStatus] = useState<EmailVerificationStatus>("pending");
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (hasRequestedRef.current) {
      return;
    }

    hasRequestedRef.current = true;

    const verify = async () => {
      const response = await verifyEmailClient(token, locale);

      if (response.ok) {
        setStatus("success");
        return;
      }

      setStatus(
        response.data?.error === EmailVerificationErrorReason.InvalidToken
          ? "invalid"
          : "error",
      );
    };

    void verify();
  }, [token, locale]);

  return status;
};
