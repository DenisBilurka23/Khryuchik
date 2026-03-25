import "server-only";

import { cache } from "react";

import type { Locale } from "@/i18n/config";
import type { ProductPlacement } from "@/types/catalog";

import {
  isLocalizedProductSummary,
  localizeProductSummary,
  toProductDetails,
} from "../mappers/product.mapper";
import {
  findActiveProductBySlug,
  findActiveProductSlugs,
  findActiveProductsByIds,
  findProductsForPlacement,
  findShopVisibleProducts,
} from "../repositories/products.repository";
import { findProductDetailsByProductId } from "../repositories/product-details.repository";

const getProductSummaryBySlug = cache(async (locale: Locale, slug: string) => {
  const product = await findActiveProductBySlug(locale, slug);

  if (!product) {
    return null;
  }

  return localizeProductSummary(product, locale);
});

export const getProductsForPlacement = cache(
  async (
    locale: Locale,
    placement: ProductPlacement,
    options?: {
      category?: string;
      limit?: number;
    },
  ) => {
    const products = await findProductsForPlacement(placement, options);

    return products
      .map((product) => localizeProductSummary(product, locale))
      .filter(isLocalizedProductSummary);
  },
);

export const getShopProducts = cache(
  async (
    locale: Locale,
    options?: {
      category?: string;
      limit?: number;
    },
  ) => {
    const products = await findShopVisibleProducts(options);

    return products
      .map((product) => localizeProductSummary(product, locale))
      .filter(isLocalizedProductSummary);
  },
);

export const getProductSummariesByIds = async (
  locale: Locale,
  productIds: string[],
) => {
  const products = await findActiveProductsByIds(productIds);
  const productsById = new Map(
    products
      .map((product) => localizeProductSummary(product, locale))
      .filter(isLocalizedProductSummary)
      .map((product) => [product.id, product]),
  );

  return productIds
    .map((productId) => productsById.get(productId) ?? null)
    .filter(isLocalizedProductSummary);
};

export const getProductDetails = cache(async (locale: Locale, slug: string) => {
  const summary = await getProductSummaryBySlug(locale, slug);

  if (!summary) {
    return null;
  }

  const detailsDocument = await findProductDetailsByProductId(summary.id);

  if (!detailsDocument) {
    return null;
  }

  return toProductDetails(summary, detailsDocument, locale);
});

export const getProductSlugs = cache(async (locale: Locale) =>
  findActiveProductSlugs(locale),
);