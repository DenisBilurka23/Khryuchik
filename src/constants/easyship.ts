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
