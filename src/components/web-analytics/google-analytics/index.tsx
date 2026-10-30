"use client";

import Script from "next/script";
import { useEffect } from "react";

import { GOOGLE_TAG_SCRIPT_ID } from "@/constants/analytics";
import {
  setGoogleAnalyticsEnabled,
  useAnalyticsConsent,
} from "@/stores/analytics";
import {
  buildGoogleTagSnippet,
  getGoogleTagSrc,
  isAnalyticsAllowed,
} from "@/utils";

import type { GoogleAnalyticsProps } from "../types";

export const GoogleAnalytics = ({
  measurementId,
  requiresConsent,
}: GoogleAnalyticsProps) => {
  const { ready, status } = useAnalyticsConsent();
  const allowed = ready && isAnalyticsAllowed(status, requiresConsent);

  useEffect(() => {
    if (ready) {
      setGoogleAnalyticsEnabled(measurementId, allowed);
    }
  }, [ready, allowed, measurementId]);

  if (!allowed) {
    return null;
  }

  return (
    <>
      <Script id={GOOGLE_TAG_SCRIPT_ID} strategy="afterInteractive">
        {buildGoogleTagSnippet(measurementId)}
      </Script>
      <Script
        src={getGoogleTagSrc(measurementId)}
        strategy="afterInteractive"
      />
    </>
  );
};
