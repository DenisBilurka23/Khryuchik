import type { Locale } from "@/i18n/config";

export type WebAnalyticsProps = {
  locale: Locale;
};

export type CloudflareBeaconProps = {
  token: string;
};

export type GoogleAnalyticsProps = {
  measurementId: string;
  requiresConsent: boolean;
};

export type MicrosoftClarityProps = {
  projectId: string;
  requiresConsent: boolean;
};

export type AnalyticsConsentBannerProps = {
  requiresConsent: boolean;
  privacyHref: string;
};
