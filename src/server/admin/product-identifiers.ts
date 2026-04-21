import "server-only";

import type { AdminProductPayload } from "@/types/admin";
import {
  buildUniqueValue,
  normalizeSkuPart,
  normalizeSlugPart,
} from "@/utils/admin";

import { findAllProductDetails } from "../catalog/repositories/product-details.repository";
import { findAllProducts } from "../catalog/repositories/products.repository";

export const populateAdminProductIdentifiers = async (
  payload: AdminProductPayload,
): Promise<AdminProductPayload> => {
  const currentProductId = payload.product.productId.trim();
  const requestedSlug =
    payload.product.slug.trim() ||
    payload.product.translations.en.title.trim();

  const [products, detailsDocuments] = await Promise.all([
    findAllProducts(),
    findAllProductDetails(),
  ]);

  const takenProductIds = new Set(
    products
      .filter((product) => product.productId !== currentProductId)
      .map((product) => product.productId.trim())
      .filter(Boolean),
  );
  const takenSlugs = new Set(
    products
      .filter((product) => product.productId !== currentProductId)
      .map((product) => product.slug.trim())
      .filter(Boolean),
  );
  const takenSkus = new Set(
    detailsDocuments
      .filter((details) => details.productId !== currentProductId)
      .map((details) => details.sku.trim().toUpperCase())
      .filter(Boolean),
  );

  const slug = buildUniqueValue(
    normalizeSlugPart(requestedSlug) || "product",
    (candidate) => takenSlugs.has(candidate),
  );
  const productId = buildUniqueValue(
    normalizeSlugPart(currentProductId || slug) || "product",
    (candidate) => takenProductIds.has(candidate),
  );
  const requestedSku =
    payload.details.sku.trim();
  const sku = buildUniqueValue(
    normalizeSkuPart(requestedSku || productId) || "SKU",
    (candidate) => takenSkus.has(candidate),
  );

  return {
    product: {
      ...payload.product,
      productId,
      slug,
    },
    details: {
      ...payload.details,
      productId,
      sku,
    },
  };
};