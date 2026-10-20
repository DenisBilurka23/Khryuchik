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
import {
  decodeJetprintVariantCursor,
  encodeJetprintVariantCursor,
} from "../variant-sync-cursor";

const VARIANT_STATUS_TIMEOUT_MS = 10_000;
const VARIANT_SYNC_MIN_REMAINING_MS = VARIANT_STATUS_TIMEOUT_MS + 5_000;

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
  const deadline = Date.now() + JETPRINT_SYNC_BUDGET_MS;
  const resume = decodeJetprintVariantCursor(cursor);
  const products = await findJetprintLinkedProducts(
    resume?.productId ?? cursor,
    Boolean(resume),
  );
  const failed: JetprintVariantSyncSummary["failed"] = [];
  let checked = 0;
  let unavailable = 0;

  for (const product of products) {
    const title = product.translations?.[defaultLocale]?.title ?? product.slug;
    const variants = product.jetprint?.variants ?? [];
    const startIndex =
      product.productId === resume?.productId
        ? Math.max(
            0,
            variants.findIndex((variant) => variant.sku === resume.sku),
          )
        : 0;

    for (const variant of variants.slice(startIndex)) {
      if (deadline - Date.now() <= VARIANT_SYNC_MIN_REMAINING_MS) {
        return {
          checked,
          unavailable,
          failed,
          nextCursor: encodeJetprintVariantCursor({
            productId: product.productId,
            sku: variant.sku,
          }),
        };
      }

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
  }

  return { checked, unavailable, failed, nextCursor: null };
};
