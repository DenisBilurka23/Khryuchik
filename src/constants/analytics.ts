import type { CountryCode } from "@/utils";

export const ANALYTICS_CONSENT_COUNTRIES: readonly CountryCode[] = [
  "AT",
  "BE",
  "BG",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "HU",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
  "IS",
  "LI",
  "NO",
  "GB",
  "CA",
];

export const ANALYTICS_CONSENT_STORAGE_KEY = "khryuchik-analytics-consent";

export const ANALYTICS_PENDING_EVENT_LIMIT = 20;

export const ANALYTICS_SETTINGS_FOOTER_KEY = "analyticsSettings";

export const CLOUDFLARE_BEACON_SRC =
  "https://static.cloudflareinsights.com/beacon.min.js";

export const GOOGLE_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/;

export const GOOGLE_TAG_SRC = "https://www.googletagmanager.com/gtag/js";

export const GOOGLE_TAG_SCRIPT_ID = "google-tag";

export const GOOGLE_ANALYTICS_COOKIE_PREFIX = "_ga";

export const GOOGLE_TAG_CONSENT_DEFAULTS = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "granted",
} as const;

export const GOOGLE_TAG_CONFIG = {
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
} as const;

export const CLARITY_TAG_SRC = "https://www.clarity.ms/tag/";

export const CLARITY_SCRIPT_ID = "clarity-tag";

export const CLARITY_PROJECT_ID_PATTERN = /^[a-z0-9]+$/i;

export const CLARITY_CONSENT_GRANTED = {
  ad_Storage: "denied",
  analytics_Storage: "granted",
} as const;

export const CLARITY_CONSENT_DENIED = {
  ad_Storage: "denied",
  analytics_Storage: "denied",
} as const;

export const CLARITY_MASK_PROPS = { "data-clarity-mask": "true" } as const;
