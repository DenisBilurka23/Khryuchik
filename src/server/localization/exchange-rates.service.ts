import "server-only";

import type { CurrencyCode } from "@/utils";

// Printify quotes products and shipping in USD only, and its API never states a
// currency, so USD is the base every converted price is derived from.
const BASE_CURRENCY = "USD";

const EXCHANGE_RATES_URL = "https://open.er-api.com/v6/latest/USD";
const RATES_TTL_MS = 24 * 60 * 60 * 1000;
const RATES_REVALIDATE_SECONDS = 24 * 60 * 60;
const RATES_TIMEOUT_MS = 4_000;
const RATES_RETRY_ATTEMPTS = 1;

type ExchangeRatesResponse = {
  result?: string;
  rates?: Record<string, number>;
};

type CachedRates = {
  rates: Record<string, number>;
  fetchedAt: number;
};

let cachedRates: CachedRates | null = null;

const lastKnownRates = new Map<CurrencyCode, number>();

const requestRates = async (): Promise<Record<string, number> | null> => {
  for (let attempt = 0; ; attempt += 1) {
    try {
      const response = await fetch(EXCHANGE_RATES_URL, {
        signal: AbortSignal.timeout(RATES_TIMEOUT_MS),
        next: { revalidate: RATES_REVALIDATE_SECONDS },
      });

      if (!response.ok) {
        throw new Error(
          `Exchange rates request failed with ${response.status}`,
        );
      }

      const payload = (await response.json()) as ExchangeRatesResponse;

      if (payload.result !== "success" || !payload.rates) {
        throw new Error("Exchange rates response carried no usable rates");
      }

      return payload.rates;
    } catch (error) {
      if (attempt >= RATES_RETRY_ATTEMPTS) {
        console.error("Failed to load USD exchange rates", error);

        return null;
      }
    }
  }
};

const getRates = async (): Promise<Record<string, number> | null> => {
  if (cachedRates && Date.now() - cachedRates.fetchedAt < RATES_TTL_MS) {
    return cachedRates.rates;
  }

  const rates = await requestRates();

  if (!rates) {
    return null;
  }

  cachedRates = { rates, fetchedAt: Date.now() };

  return rates;
};

export const getUsdRate = async (
  currency: CurrencyCode,
): Promise<number | null> => {
  if (currency === BASE_CURRENCY) {
    return 1;
  }

  const rates = await getRates();
  const rate = rates?.[currency];

  if (typeof rate === "number" && rate > 0) {
    lastKnownRates.set(currency, rate);

    return rate;
  }

  return lastKnownRates.get(currency) ?? null;
};

export { BASE_CURRENCY };
