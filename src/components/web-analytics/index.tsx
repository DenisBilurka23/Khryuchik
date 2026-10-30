import {
  getClarityProjectId,
  getCloudflareAnalyticsToken,
  getGoogleAnalyticsId,
  requiresRequestAnalyticsConsent,
} from "@/server/analytics/analytics-config";
import { getLocalizedPath } from "@/utils";

import { CloudflareBeacon } from "./cloudflare-beacon";
import { AnalyticsConsentBanner } from "./consent-banner";
import { GoogleAnalytics } from "./google-analytics";
import { MicrosoftClarity } from "./microsoft-clarity";
import type { WebAnalyticsProps } from "./types";

export const WebAnalytics = async ({ locale }: WebAnalyticsProps) => {
  const cloudflareToken = getCloudflareAnalyticsToken();
  const measurementId = getGoogleAnalyticsId();
  const clarityProjectId = getClarityProjectId();
  const needsConsentChoice =
    measurementId !== null || clarityProjectId !== null;
  const requiresConsent = needsConsentChoice
    ? await requiresRequestAnalyticsConsent()
    : false;

  return (
    <>
      {cloudflareToken ? <CloudflareBeacon token={cloudflareToken} /> : null}
      {measurementId ? (
        <GoogleAnalytics
          measurementId={measurementId}
          requiresConsent={requiresConsent}
        />
      ) : null}
      {clarityProjectId ? (
        <MicrosoftClarity
          projectId={clarityProjectId}
          requiresConsent={requiresConsent}
        />
      ) : null}
      {needsConsentChoice ? (
        <AnalyticsConsentBanner
          requiresConsent={requiresConsent}
          privacyHref={getLocalizedPath(locale, "/privacy")}
        />
      ) : null}
    </>
  );
};

export type { WebAnalyticsProps } from "./types";
