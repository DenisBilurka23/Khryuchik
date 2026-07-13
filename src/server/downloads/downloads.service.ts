import "server-only";

import { findProductDetailsByProductId } from "@/server/catalog/repositories/product-details.repository";
import { findOrdersForUser } from "@/server/orders/repositories/orders.repository";
import { BOOK_FORMAT } from "@/constants/catalog";
import type { AccountDownload } from "@/types/download";

export const getUserPurchasedDownloads = async (
  userId: string | undefined,
  email: string | undefined,
): Promise<AccountDownload[]> => {
  const orders = await findOrdersForUser(userId, email);
  const paidOrders = orders.filter((o) => o.payment.status === "paid");

  if (paidOrders.length === 0) {
    return [];
  }

  const seen = new Set<string>();
  const candidates: {
    productId: string;
    productTitle: string;
    locale: string;
  }[] = [];

  for (const order of paidOrders) {
    for (const item of order.items) {
      const isDigital =
        !item.formatSelection || item.formatSelection === BOOK_FORMAT.digital;

      if (!isDigital) continue;

      const assetLocale = item.languageSelection ?? order.locale;
      const key = `${item.productId}:${assetLocale}`;
      if (!seen.has(key)) {
        seen.add(key);
        candidates.push({
          productId: item.productId,
          productTitle: item.title,
          locale: assetLocale,
        });
      }
    }
  }

  const downloads: AccountDownload[] = [];
  const seenAssetIds = new Set<string>();

  await Promise.all(
    candidates.map(async ({ productId, productTitle, locale }) => {
      const details = await findProductDetailsByProductId(productId);
      const assets = details?.translations[locale]?.digitalAssets;

      if (!assets || assets.length === 0) {
        return;
      }

      for (const asset of assets) {
        if (seenAssetIds.has(asset.id)) continue;
        seenAssetIds.add(asset.id);

        downloads.push({
          productId,
          productTitle,
          assetId: asset.id,
          label: asset.label,
          format: asset.format.toUpperCase(),
          locale,
          sizeBytes: asset.sizeBytes,
          downloadUrl: `/api/account/downloads/${asset.id}`,
        });
      }
    }),
  );

  return downloads;
};

export const getOwnedProductLanguages = async (
  userId: string | undefined,
  email: string | undefined,
  productId: string,
): Promise<string[]> => {
  const orders = await findOrdersForUser(userId, email);
  const paidOrders = orders.filter((o) => o.payment.status === "paid");

  const languages = new Set<string>();

  for (const order of paidOrders) {
    for (const item of order.items) {
      if (item.productId !== productId) continue;

      const isDigital =
        !item.formatSelection || item.formatSelection === BOOK_FORMAT.digital;

      if (!isDigital) continue;

      languages.add(item.languageSelection ?? order.locale);
    }
  }

  return [...languages];
};

export type PurchasedAsset = {
  objectKey: string;
  fileName: string;
  contentType?: string;
};

export const findPurchasedAsset = async (
  userId: string | undefined,
  email: string | undefined,
  assetId: string,
): Promise<PurchasedAsset | null> => {
  const orders = await findOrdersForUser(userId, email);
  const paidOrders = orders.filter((o) => o.payment.status === "paid");

  for (const order of paidOrders) {
    for (const item of order.items) {
      const isDigital =
        !item.formatSelection || item.formatSelection === BOOK_FORMAT.digital;

      if (!isDigital) continue;

      const details = await findProductDetailsByProductId(item.productId);
      const assetLocale = item.languageSelection ?? order.locale;
      const assets = details?.translations[assetLocale]?.digitalAssets;

      if (!assets) continue;

      const asset = assets.find((a) => a.id === assetId);
      if (asset) {
        return {
          objectKey: asset.objectKey,
          fileName: asset.fileName,
          contentType: asset.contentType,
        };
      }
    }
  }

  return null;
};
