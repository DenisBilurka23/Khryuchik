import "server-only";

import { cache } from "react";

import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/shared/countries";
import type { ProductPlacement } from "@/types/catalog";
import type { CartItem, StoredCartItem } from "@/types/cart";
import type { ProductOption } from "@/types/product-details";

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

const getProductSummaryBySlug = cache(async (
  locale: Locale,
  country: CountryCode,
  slug: string,
) => {
  const product = await findActiveProductBySlug(locale, slug);

  if (!product) {
    return null;
  }

  return localizeProductSummary(product, locale, country);
});

export const getProductsForPlacement = cache(
  async (
    locale: Locale,
    country: CountryCode,
    placement: ProductPlacement,
    options?: {
      category?: string;
      limit?: number;
    },
  ) => {
    const products = await findProductsForPlacement(placement, options);

    return products
      .map((product) => localizeProductSummary(product, locale, country))
      .filter(isLocalizedProductSummary);
  },
);

export const getShopProducts = cache(
  async (
    locale: Locale,
    country: CountryCode,
    options?: {
      category?: string;
      limit?: number;
    },
  ) => {
    const products = await findShopVisibleProducts(options);

    return products
      .map((product) => localizeProductSummary(product, locale, country))
      .filter(isLocalizedProductSummary);
  },
);

export const getProductSummariesByIds = async (
  locale: Locale,
  country: CountryCode,
  productIds: string[],
) => {
  const products = await findActiveProductsByIds(productIds);
  const productsById = new Map(
    products
      .map((product) => localizeProductSummary(product, locale, country))
      .filter(isLocalizedProductSummary)
      .map((product) => [product.id, product]),
  );

  return productIds
    .map((productId) => productsById.get(productId) ?? null)
    .filter(isLocalizedProductSummary);
};

export const getProductDetails = cache(async (
  locale: Locale,
  country: CountryCode,
  slug: string,
) => {
  const summary = await getProductSummaryBySlug(locale, country, slug);

  if (!summary) {
    return null;
  }

  const detailsDocument = await findProductDetailsByProductId(summary.id);

  if (!detailsDocument) {
    return null;
  }

  return toProductDetails(summary, detailsDocument, locale, country);
});

const getSelectionLabel = (
  options: ProductOption[] | undefined,
  value: string | undefined,
) => {
  if (!value) {
    return null;
  }

  return options?.find((option) => option.value === value)?.label ?? value;
};

const buildVariantLabel = (
  item: StoredCartItem,
  detailsDocument: Awaited<ReturnType<typeof findProductDetailsByProductId>>,
  locale: Locale,
) => {
  const translation = detailsDocument?.translations[locale];

  if (!translation || !item.selections) {
    return undefined;
  }

  const variant = [
    getSelectionLabel(translation.languages, item.selections.language),
    getSelectionLabel(translation.formats, item.selections.format),
    getSelectionLabel(translation.sizes, item.selections.size),
    getSelectionLabel(translation.colors, item.selections.color),
  ]
    .filter(Boolean)
    .join(" / ");

  return variant || undefined;
};

export const resolveCartItems = async (
  locale: Locale,
  country: CountryCode,
  items: StoredCartItem[],
): Promise<CartItem[]> => {
  const productIds = Array.from(new Set(items.map((item) => item.productId)));
  const summaries = await getProductSummariesByIds(locale, country, productIds);
  const summaryById = new Map(summaries.map((summary) => [summary.id, summary]));
  const detailsEntries = await Promise.all(
    productIds.map(async (productId) => [
      productId,
      await findProductDetailsByProductId(productId),
    ] as const),
  );
  const detailsById = new Map(detailsEntries);

  return items.flatMap((item) => {
    const summary = summaryById.get(item.productId);

    if (!summary) {
      return [];
    }

    return [
      {
        id: item.id,
        productId: item.productId,
        slug: summary.slug,
        title: summary.title,
        price: summary.price,
        currency: summary.currency,
        emoji: summary.emoji,
        bgColor: summary.bgColor,
        quantity: item.quantity,
        variant: buildVariantLabel(
          item,
          detailsById.get(item.productId) ?? null,
          locale,
        ),
      },
    ];
  });
};

export const getProductSlugs = cache(async (locale: Locale) =>
  findActiveProductSlugs(locale),
);