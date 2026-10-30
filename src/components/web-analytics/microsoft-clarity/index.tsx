"use client";

import Script from "next/script";
import { useEffect } from "react";

import { CLARITY_SCRIPT_ID } from "@/constants/analytics";
import { setClarityEnabled, useAnalyticsConsent } from "@/stores/analytics";
import {
  buildClaritySnippet,
  getClarityTagSrc,
  isAnalyticsAllowed,
} from "@/utils";

import type { MicrosoftClarityProps } from "../types";

export const MicrosoftClarity = ({
  projectId,
  requiresConsent,
}: MicrosoftClarityProps) => {
  const { ready, status } = useAnalyticsConsent();
  const allowed = ready && isAnalyticsAllowed(status, requiresConsent);

  useEffect(() => {
    if (ready) {
      setClarityEnabled(allowed);
    }
  }, [ready, allowed]);

  if (!allowed) {
    return null;
  }

  return (
    <>
      <Script id={CLARITY_SCRIPT_ID} strategy="afterInteractive">
        {buildClaritySnippet()}
      </Script>
      <Script src={getClarityTagSrc(projectId)} strategy="afterInteractive" />
    </>
  );
};
