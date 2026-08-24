import "server-only";

import { clientIpHeaderNames } from "@/constants/rate-limit";

type CounterWindow = {
  count: number;
  resetAt: number;
};

const windows = new Map<string, CounterWindow>();

const MAX_TRACKED_KEYS = 5_000;

export type RateLimitResult = {
  isAllowed: boolean;
  retryAfterSeconds: number;
};

export const consumeRateLimit = ({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}): RateLimitResult => {
  const now = Date.now();
  const current = windows.get(key);

  if (!current || now >= current.resetAt) {
    if (windows.size >= MAX_TRACKED_KEYS) {
      const oldestKey = windows.keys().next().value;

      if (oldestKey !== undefined) {
        windows.delete(oldestKey);
      }
    }

    windows.set(key, { count: 1, resetAt: now + windowMs });

    return { isAllowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    return {
      isAllowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;

  return { isAllowed: true, retryAfterSeconds: 0 };
};

export const getClientIpKey = (headers: Headers) => {
  for (const name of clientIpHeaderNames) {
    const value = headers.get(name);

    if (value) {
      const first = value.split(",")[0]?.trim();

      if (first) {
        return first;
      }
    }
  }

  return "unknown";
};
