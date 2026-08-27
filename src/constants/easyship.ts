import type { CountryCode } from "@/utils";

export const EASYSHIP_API_BASE = "https://public-api.easyship.com/2024-09";

export const EASYSHIP_SANDBOX_API_BASE =
  "https://public-api-sandbox.easyship.com/2024-09";

export const EASYSHIP_SANDBOX_TOKEN_PREFIX = "sand_";

export const EASYSHIP_TIMEOUT_MS = 8_000;

export const EASYSHIP_CONTENTS_DESCRIPTION = "Printed books";

export const EASYSHIP_HAS_TRACKING = true;

export const EASYSHIP_SKIPPED_DESTINATIONS: readonly CountryCode[] = [
  "BE",
  "BY",
  "RU",
];

// Transcribed from Easyship's tracking-status vocabulary, unverified against a
// live shipment: their Belgium origin returns no couriers, so no label has ever
// been bought. Only `delivered` closes a parcel; the in-transit list just keeps
// the cron summary readable, and anything else is logged rather than guessed at.
export const EASYSHIP_DELIVERED_STATUSES = ["delivered"];
export const EASYSHIP_IN_TRANSIT_STATUSES = [
  "label_generated",
  "not_yet_in_transit",
  "in_transit",
  "out_for_delivery",
  "failed_attempt",
];
