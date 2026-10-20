import "server-only";

import {
  JETPRINT_SYNC_BUDGET_MS,
  JETPRINT_VARIANT_STATUS,
} from "@/constants/jetprint";
import { defaultLocale } from "@/i18n/config";
import {
  findJetprintLinkedProducts,
  updateProductJetprintVariantStatus,
} from "@/server/catalog/repositories/products.repository";
import { notifyAdminJetprintVariantUnavailable } from "@/server/payments/telegram";

import { jetprintRequest } from "../client";
import type { JetprintVariantStatusResponse } from "../types";

const VARIANT_STATUS_TIMEOUT_MS = 10_000;

export const fetchJetprintVariantStatus = async (
  sku: string,
): Promise<number> => {
  const response = await jetprintRequest<JetprintVariantStatusResponse>(
    "/product/variant/status/query",
    { sku },
    { timeoutMs: VARIANT_STATUS_TIMEOUT_MS },
  );

  return response.status;
};

export type JetprintVariantSyncSummary = {
  checked: number;
  unavailable: number;
  failed: { productId: string; sku: string; error: string }[];
  nextCursor: string | null;
};

export const syncJetprintVariantAvailability = async (
  cursor?: string,
): Promise<JetprintVariantSyncSummary> => {
  const products = await findJetprintLinkedProducts(cursor);
  const deadline = Date.now() + JETPRINT_SYNC_BUDGET_MS;
  const failed: JetprintVariantSyncSummary["failed"] = [];
  let processed = 0;
  let checked = 0;
  let unavailable = 0;
  let nextCursor: string | null = null;

  for (const product of products) {
    if (processed > 0 && Date.now() >= deadline) {
      nextCursor = products[processed - 1].productId;
      break;
    }

    const title = product.translations?.[defaultLocale]?.title ?? product.slug;

    for (const variant of product.jetprint?.variants ?? []) {
      try {
        const status = await fetchJetprintVariantStatus(variant.sku);
        const isAvailable = status === JETPRINT_VARIANT_STATUS.active;

        await updateProductJetprintVariantStatus(
          product.productId,
          variant.sku,
          isAvailable,
          new Date().toISOString(),
        );
        checked += 1;

        if (!isAvailable) {
          unavailable += 1;
        }

        if (variant.isAvailable && !isAvailable) {
          await notifyAdminJetprintVariantUnavailable(
            title,
            variant.sku,
            status === JETPRINT_VARIANT_STATUS.removed,
          );
        }
      } catch (error) {
        console.error(
          `JetPrint availability check failed for ${variant.sku} of ${product.productId}`,
          error,
        );
        failed.push({
          productId: product.productId,
          sku: variant.sku,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    processed += 1;
  }

  return { checked, unavailable, failed, nextCursor };
};
