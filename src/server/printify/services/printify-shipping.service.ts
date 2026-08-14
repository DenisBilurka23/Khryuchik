import "server-only";

import { PRINTIFY_RESTRICTED_COUNTRIES } from "@/constants/printify";
import { findProductsByIds } from "@/server/catalog/repositories/products.repository";
import type { CartSelections } from "@/types/cart";

import {
  getPrintifyConfig,
  PrintifyApiError,
  PrintifyConfigError,
  printifyRequest,
} from "../client";
import type {
  PrintifyShippingLineItem,
  PrintifyShippingRequest,
  PrintifyShippingResponse,
} from "../types";
import { findPrintifyVariant } from "../variant-mapping";

const QUOTE_TIMEOUT_MS = 4_000;
const QUOTE_RETRY_ATTEMPTS = 1;
const QUOTE_CACHE_TTL_MS = 10 * 60 * 1000;
// A failed quote is cached briefly so a shopper still editing the address stops
// re-sending the same doomed request on every keystroke.
const FAILED_QUOTE_CACHE_TTL_MS = 30 * 1000;
const QUOTE_CACHE_MAX_ENTRIES = 200;

export type ShippingQuoteItem = {
  productId: string;
  quantity: number;
  selections?: CartSelections;
};

export type ShippingQuoteAddress = {
  country: string;
  region?: string;
  city?: string;
  postalCode?: string;
  line1?: string;
};

export type PrintifyShippingQuote =
  | { status: "no-merch" }
  | { status: "quoted"; amountCents: number }
  | { status: "unsupported-destination" }
  | { status: "unsupported-variant" }
  | { status: "unavailable" };

type CachedQuote = {
  quote: PrintifyShippingQuote;
  expiresAt: number;
};

const quoteCache = new Map<string, CachedQuote>();

const buildCacheKey = (
  lineItems: PrintifyShippingLineItem[],
  address: ShippingQuoteAddress,
) =>
  [
    address.country,
    address.postalCode ?? "",
    ...lineItems
      .map((item) => `${item.variant_id}x${item.quantity}`)
      .sort((a, b) => a.localeCompare(b)),
  ].join("|");

const readCache = (key: string) => {
  const cached = quoteCache.get(key);

  if (!cached) {
    return null;
  }

  if (Date.now() > cached.expiresAt) {
    quoteCache.delete(key);

    return null;
  }

  return cached.quote;
};

const writeCache = (
  key: string,
  quote: PrintifyShippingQuote,
  ttlMs: number,
) => {
  if (quoteCache.size >= QUOTE_CACHE_MAX_ENTRIES) {
    const oldestKey = quoteCache.keys().next().value;

    if (oldestKey !== undefined) {
      quoteCache.delete(oldestKey);
    }
  }

  quoteCache.set(key, { quote, expiresAt: Date.now() + ttlMs });
};

const buildLineItems = async (
  items: ShippingQuoteItem[],
): Promise<PrintifyShippingLineItem[] | null> => {
  const productIds = Array.from(new Set(items.map((item) => item.productId)));
  const products = await findProductsByIds(productIds);
  const productById = new Map(
    products.map((product) => [product.productId, product]),
  );
  const lineItems: PrintifyShippingLineItem[] = [];

  for (const item of items) {
    const printify = productById.get(item.productId)?.printify;

    if (!printify) {
      continue;
    }

    const variant = findPrintifyVariant(printify.variants, {
      size: item.selections?.size,
      color: item.selections?.color,
    });

    if (!variant) {
      console.error(
        `No Printify variant matches product ${item.productId} for the selected options`,
      );

      return null;
    }

    lineItems.push({
      product_id: printify.printifyProductId,
      variant_id: variant.variantId,
      quantity: item.quantity,
    });
  }

  return lineItems;
};

const isRetryableError = (error: unknown) => {
  if (error instanceof PrintifyConfigError) {
    return false;
  }

  if (error instanceof PrintifyApiError) {
    return error.status === 429 || error.status >= 500;
  }

  return true;
};

const requestQuote = async (
  shopId: string,
  payload: PrintifyShippingRequest,
): Promise<PrintifyShippingResponse | null> => {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await printifyRequest<PrintifyShippingResponse>(
        `/shops/${shopId}/orders/shipping.json`,
        { method: "POST", body: payload, timeoutMs: QUOTE_TIMEOUT_MS },
      );
    } catch (error) {
      if (attempt >= QUOTE_RETRY_ATTEMPTS || !isRetryableError(error)) {
        console.error("Printify shipping quote failed", error);

        return null;
      }
    }
  }
};

export const getPrintifyShippingQuote = async (
  items: ShippingQuoteItem[],
  address: ShippingQuoteAddress,
): Promise<PrintifyShippingQuote> => {
  const lineItems = await buildLineItems(items);

  if (lineItems === null) {
    return { status: "unsupported-variant" };
  }

  if (lineItems.length === 0) {
    return { status: "no-merch" };
  }

  if (PRINTIFY_RESTRICTED_COUNTRIES.includes(address.country.toUpperCase())) {
    return { status: "unsupported-destination" };
  }

  const shopId = getPrintifyConfig()?.shopId;

  if (!shopId) {
    console.error("PRINTIFY_SHOP_ID is not set; cannot quote shipping");

    return { status: "unavailable" };
  }

  const cacheKey = buildCacheKey(lineItems, address);
  const cached = readCache(cacheKey);

  if (cached) {
    return cached;
  }

  const response = await requestQuote(shopId, {
    line_items: lineItems,
    address_to: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      country: address.country,
      region: address.region ?? "",
      address1: address.line1 ?? "",
      city: address.city ?? "",
      zip: address.postalCode ?? "",
    },
  });

  if (!response) {
    const failure: PrintifyShippingQuote = { status: "unavailable" };

    writeCache(cacheKey, failure, FAILED_QUOTE_CACHE_TTL_MS);

    return failure;
  }

  const quote: PrintifyShippingQuote =
    typeof response.standard === "number"
      ? { status: "quoted", amountCents: response.standard }
      : { status: "unsupported-destination" };

  writeCache(cacheKey, quote, QUOTE_CACHE_TTL_MS);

  return quote;
};
