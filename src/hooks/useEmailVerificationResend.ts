"use client";

import { useState } from "react";
import { resendEmailVerificationClient } from "@/client-api/auth";
import type { Locale } from "@/i18n/config";
import type {
  EmailVerificationResendStatus,
  UseEmailVerificationResendResult,
} from "./useEmailVerificationResend.types";

export const useEmailVerificationResend = (
  locale: Locale,
): UseEmailVerificationResendResult => {
  const [status, setStatus] = useState<EmailVerificationResendStatus>("idle");

  const resend = async (email: string) => {
    setStatus("sending");

    const response = await resendEmailVerificationClient(email, locale);

    setStatus(response.ok ? "sent" : "error");
  };

  const reset = () => setStatus("idle");

  return { status, resend, reset };
};
