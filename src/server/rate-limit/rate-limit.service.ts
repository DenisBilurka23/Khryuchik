import "server-only";

import { clientIpHeaderNames } from "@/constants/rate-limit";

import {
  deleteRateLimitCounter,
  incrementRateLimitCounter,
} from "./rate-limit.repository";

export type RateLimitResult = {
  isAllowed: boolean;
  retryAfterSeconds: number;
};

export const consumeRateLimit = async ({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}): Promise<RateLimitResult> => {
  try {
    const { count, resetAt } = await incrementRateLimitCounter({
      key,
      windowMs,
    });

    if (count <= limit) {
      return { isAllowed: true, retryAfterSeconds: 0 };
    }

    return {
      isAllowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((resetAt.getTime() - Date.now()) / 1000),
      ),
    };
  } catch (error) {
    console.error("Rate limit check failed", error);

    return { isAllowed: true, retryAfterSeconds: 0 };
  }
};

export const resetRateLimit = async (key: string): Promise<void> => {
  try {
    await deleteRateLimitCounter(key);
  } catch (error) {
    console.error("Rate limit reset failed", error);
  }
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
