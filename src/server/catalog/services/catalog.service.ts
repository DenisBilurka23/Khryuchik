import "server-only";

import { cache } from "react";

import type { Locale } from "@/i18n/config";
import {
  type CountryCode,
  isLocalizedProductSummary,
  localizeProductSummary,
  toProductDetails,
} from "@/utils";
import type { ProductDocument, ProductPlacement } from "@/types/catalog";
import type { CartItem, StoredCartItem } from "@/types/cart";
import { BOOK_FORMAT } from "@/constants/catalog";
import type { ProductOption } from "@/types/product-details";
import {
  findActiveProductBySlug,
  findActiveProductsByIds,
  findActiveProductSlugs,
  findLatestBook,
  findProductsForPlacement,
  findShopVisibleProducts,
} from "../repositories/products.repository";
import { findProductDetailsByProductId } from "../repositories/product-details.repository";
import { getApprovedReviewsForProduct } from "@/server/reviews/services/reviews.service";

const localizeProductSummaries = (
  products: ProductDocument[],
  locale: Locale,
  country: CountryCode,
) =>
  products
    .map((product) => localizeProductSummary(product, locale, country))
    .filter(isLocalizedProductSummary);

const getProductSummaryBySlug = cache(
  async (locale: Locale, country: CountryCode, slug: string) => {
    const product = await findActiveProductBySlug(locale, slug);

    if (!product) {
      return null;
    }

    return localizeProductSummary(product, locale, country);
  },
);

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

    return localizeProductSummaries(products, locale, country);
  },
);

export const getLatestBookSummary = cache(
  async (locale: Locale, country: CountryCode) => {
    const product = await findLatestBook();

    if (!product) {
      return null;
    }

    const summary = localizeProductSummary(product, locale, country);

    return isLocalizedProductSummary(summary) ? summary : null;
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

    return localizeProductSummaries(products, locale, country);
  },
);

export const getProductSummariesByIds = async (
  locale: Locale,
  country: CountryCode,
  productIds: string[],
) => {
  const products = await findActiveProductsByIds(productIds);
  const summaries = localizeProductSummaries(products, locale, country);
  const productsById = new Map(
    summaries.map((product) => [product.id, product]),
  );

  return productIds
    .map((productId) => productsById.get(productId) ?? null)
    .filter(isLocalizedProductSummary);
};

export const getProductDetails = cache(
  async (locale: Locale, country: CountryCode, slug: string) => {
    const summary = await getProductSummaryBySlug(locale, country, slug);

    if (!summary) {
      return null;
    }

    const detailsDocument = await findProductDetailsByProductId(summary.id);

    if (!detailsDocument) {
      return null;
    }

    const details = toProductDetails(summary, detailsDocument, locale, country);

    if (!details) {
      return null;
    }

    const approvedReviews = await getApprovedReviewsForProduct(
      summary.id,
      locale,
    );

    return {
      ...details,
      reviews: [...details.reviews, ...approvedReviews],
    };
  },
);

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
  const summaryById = new Map(
    summaries.map((summary) => [summary.id, summary]),
  );
  const detailsEntries = await Promise.all(
    productIds.map(
      async (productId) =>
        [productId, await findProductDetailsByProductId(productId)] as const,
    ),
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
        thumbnail: summary.thumbnail,
        thumbnailBackgroundColor: summary.thumbnailBackgroundColor,
        quantity: item.quantity,
        variant: buildVariantLabel(
          item,
          detailsById.get(item.productId) ?? null,
          locale,
        ),
        isDigital: item.selections?.format === BOOK_FORMAT.digital,
      },
    ];
  });
};

export const getProductSlugs = cache(async () => findActiveProductSlugs());
