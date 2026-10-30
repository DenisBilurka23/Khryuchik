import "server-only";

import { headers } from "next/headers";

import {
  CLARITY_PROJECT_ID_PATTERN,
  GOOGLE_MEASUREMENT_ID_PATTERN,
} from "@/constants/analytics";
import { getCountryFromGeoHeaders, isAnalyticsConsentCountry } from "@/utils";

const readProductionValue = (value: string | undefined) =>
  process.env.NODE_ENV === "production" && value ? value : null;

export const getCloudflareAnalyticsToken = () =>
  readProductionValue(process.env.CLOUDFLARE_ANALYTICS_TOKEN);

export const getGoogleAnalyticsId = () => {
  const measurementId = readProductionValue(process.env.GA_MEASUREMENT_ID);

  return measurementId && GOOGLE_MEASUREMENT_ID_PATTERN.test(measurementId)
    ? measurementId
    : null;
};

export const getClarityProjectId = () => {
  const projectId = readProductionValue(process.env.CLARITY_PROJECT_ID);

  return projectId && CLARITY_PROJECT_ID_PATTERN.test(projectId)
    ? projectId
    : null;
};

export const hasConsentBasedAnalytics = () =>
  getGoogleAnalyticsId() !== null || getClarityProjectId() !== null;

export const requiresRequestAnalyticsConsent = async () =>
  isAnalyticsConsentCountry(getCountryFromGeoHeaders(await headers()));
