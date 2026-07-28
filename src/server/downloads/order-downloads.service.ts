import "server-only";

import { createHash, randomBytes } from "crypto";

import { findProductDetailsByProductId } from "@/server/catalog/repositories/product-details.repository";
import { findOrderById } from "@/server/orders/repositories/orders.repository";
import type { OrderDocument } from "@/types/order";
import type { OrderDownload, OrderDownloadBundle } from "@/types/download";
import type { Locale } from "@/i18n/config";
import { getLocalizedPath, isDigitalOrderItem } from "@/utils";

import {
  findActiveOrderDownloadToken,
  insertOrderDownloadToken,
} from "./order-download-tokens.repository";
import type { PurchasedAsset } from "./downloads.service";

const ORDER_DOWNLOAD_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 90;

const createOrderDownloadToken = () => randomBytes(32).toString("hex");

const hashOrderDownloadToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const collectOrderDownloads = async (
  order: OrderDocument,
  buildDownloadUrl: (assetId: string) => string,
): Promise<OrderDownload[]> => {
  const downloads: OrderDownload[] = [];
  const seenAssetIds = new Set<string>();

  for (const item of order.items) {
    if (!isDigitalOrderItem(item)) {
      continue;
    }

    const details = await findProductDetailsByProductId(item.productId);
    const assetLocale = item.languageSelection ?? order.locale;
    const assets = details?.translations[assetLocale]?.digitalAssets;

    if (!assets) {
      continue;
    }

    for (const asset of assets) {
      if (seenAssetIds.has(asset.id)) {
        continue;
      }
      seenAssetIds.add(asset.id);

      downloads.push({
        productTitle: item.title,
        assetId: asset.id,
        label: asset.label,
        format: asset.format.toUpperCase(),
        sizeBytes: asset.sizeBytes,
        downloadUrl: buildDownloadUrl(asset.id),
      });
    }
  }

  return downloads;
};

// Each call mints a separate link; existing ones keep working, so re-sending
// the confirmation email never breaks the link a customer already has.
export const issueOrderDownloadToken = async (
  order: OrderDocument,
): Promise<string | null> => {
  const hasDigitalItems = order.items.some(isDigitalOrderItem);

  if (!hasDigitalItems) {
    return null;
  }

  const downloads = await collectOrderDownloads(order, () => "");

  if (downloads.length === 0) {
    return null;
  }

  const token = createOrderDownloadToken();
  const expiresAt = new Date(Date.now() + ORDER_DOWNLOAD_TOKEN_TTL_MS);

  await insertOrderDownloadToken(
    order.id,
    hashOrderDownloadToken(token),
    expiresAt,
  );

  return token;
};

// In-app entry point to the token page: hands a just-paid buyer their files
// without waiting for the confirmation email. Returns null when there is
// nothing to download, so callers can simply omit the button.
export const buildOrderDownloadsHref = async (
  order: OrderDocument | null,
  locale: Locale,
): Promise<string | null> => {
  if (!order || order.payment.status !== "paid") {
    return null;
  }

  const token = await issueOrderDownloadToken(order);

  return token ? getLocalizedPath(locale, `/downloads/${token}`) : null;
};

const findPaidOrderByToken = async (
  token: string,
): Promise<OrderDocument | null> => {
  const downloadToken = await findActiveOrderDownloadToken(
    hashOrderDownloadToken(token),
  );

  if (!downloadToken) {
    return null;
  }

  const order = await findOrderById(downloadToken.orderId);

  if (!order || order.payment.status !== "paid") {
    return null;
  }

  return order;
};

export const getOrderDownloadsByToken = async (
  token: string,
): Promise<OrderDownloadBundle | null> => {
  const order = await findPaidOrderByToken(token);

  if (!order) {
    return null;
  }

  const downloads = await collectOrderDownloads(
    order,
    (assetId) => `/api/downloads/${assetId}?token=${encodeURIComponent(token)}`,
  );

  if (downloads.length === 0) {
    return null;
  }

  return { orderId: order.id, locale: order.locale, downloads };
};

export const findOrderAssetByToken = async (
  token: string,
  assetId: string,
): Promise<PurchasedAsset | null> => {
  const order = await findPaidOrderByToken(token);

  if (!order) {
    return null;
  }

  for (const item of order.items) {
    if (!isDigitalOrderItem(item)) {
      continue;
    }

    const details = await findProductDetailsByProductId(item.productId);
    const assetLocale = item.languageSelection ?? order.locale;
    const asset = details?.translations[assetLocale]?.digitalAssets?.find(
      (candidate) => candidate.id === assetId,
    );

    if (asset) {
      return {
        objectKey: asset.objectKey,
        fileName: asset.fileName,
        contentType: asset.contentType,
      };
    }
  }

  return null;
};
