import "server-only";

import { ObjectId } from "mongodb";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getProductSummariesByIds } from "@/server/catalog/services/catalog.service";
import { findActiveProductsByIds } from "@/server/catalog/repositories/products.repository";
import { getUserWishlist, setUserWishlist } from "@/server/users/repositories/users.repository";
import type { LocalizedProductSummary } from "@/types/catalog";
import type { WishlistEntryDocument } from "@/types/users";
import type { CountryCode } from "@/utils";

export type WishlistProductItem = {
  productId: string;
  addedAt: string;
  product: LocalizedProductSummary;
};

const normalizeProductIds = (productIds: string[]) =>
  Array.from(
    new Set(
      productIds
        .map((productId) => productId.trim())
        .filter(Boolean),
    ),
  );

const validateUserId = (userId: string) =>
  ObjectId.isValid(userId) ? new ObjectId(userId) : null;

const filterExistingProductIds = async (productIds: string[]) => {
  const normalizedProductIds = normalizeProductIds(productIds);

  if (normalizedProductIds.length === 0) {
    return [];
  }

  const products = await findActiveProductsByIds(normalizedProductIds);
  const existingIds = new Set(products.map((product) => product.productId));

  return normalizedProductIds.filter((productId) => existingIds.has(productId));
};

export const getWishlistEntries = async (userId: string) => {
  const objectId = validateUserId(userId);

  if (!objectId) {
    return [];
  }

  return getUserWishlist(objectId);
};

export const addProductToWishlist = async (userId: string, productId: string) => {
  const objectId = validateUserId(userId);

  if (!objectId) {
    return [];
  }

  const [validatedProductId] = await filterExistingProductIds([productId]);

  if (!validatedProductId) {
    return getUserWishlist(objectId);
  }

  const wishlist = await getUserWishlist(objectId);

  if (wishlist.some((entry) => entry.productId === validatedProductId)) {
    return wishlist;
  }

  return setUserWishlist(objectId, [
    { productId: validatedProductId, addedAt: new Date() },
    ...wishlist,
  ]);
};

export const removeProductFromWishlist = async (userId: string, productId: string) => {
  const objectId = validateUserId(userId);

  if (!objectId) {
    return [];
  }

  const wishlist = await getUserWishlist(objectId);

  return setUserWishlist(
    objectId,
    wishlist.filter((entry) => entry.productId !== productId.trim()),
  );
};

export const mergeWishlistEntries = async (userId: string, productIds: string[]) => {
  const objectId = validateUserId(userId);

  if (!objectId) {
    return [];
  }

  const validProductIds = await filterExistingProductIds(productIds);
  const wishlist = await getUserWishlist(objectId);
  const existingIds = new Set(wishlist.map((entry) => entry.productId));
  const nextEntries: WishlistEntryDocument[] = [
    ...validProductIds
      .filter((productId) => !existingIds.has(productId))
      .map((productId) => ({ productId, addedAt: new Date() })),
    ...wishlist,
  ];

  return setUserWishlist(objectId, nextEntries);
};

export const getWishlistIds = (wishlist: WishlistEntryDocument[]) =>
  wishlist.map((entry) => entry.productId);

export const getResolvedWishlistItems = async (
  userId: string,
  locale: Locale,
  country: CountryCode,
) => {
  const wishlist = await getWishlistEntries(userId);
  const summaries = await getProductSummariesByIds(
    locale,
    country,
    getWishlistIds(wishlist),
  );
  const summariesById = new Map(summaries.map((summary) => [summary.id, summary]));

  return wishlist.flatMap((entry): WishlistProductItem[] => {
    const product = summariesById.get(entry.productId);

    if (!product) {
      return [];
    }

    return [
      {
        productId: entry.productId,
        addedAt: entry.addedAt.toISOString(),
        product,
      },
    ];
  });
};

export const resolveGuestWishlistItems = async (
  locale: string | null,
  country: CountryCode,
  items: Array<{ productId?: string; addedAt?: string }>,
) => {
  const nextLocale = locale && isLocale(locale) ? locale : defaultLocale;
  const normalizedItems = items
    .map((item) => ({
      productId: typeof item.productId === "string" ? item.productId.trim() : "",
      addedAt: typeof item.addedAt === "string" ? item.addedAt : new Date(0).toISOString(),
    }))
    .filter((item) => item.productId);
  const summaries = await getProductSummariesByIds(
    nextLocale,
    country,
    normalizedItems.map((item) => item.productId),
  );
  const summariesById = new Map(summaries.map((summary) => [summary.id, summary]));

  return normalizedItems.flatMap((item): WishlistProductItem[] => {
    const product = summariesById.get(item.productId);

    if (!product) {
      return [];
    }

    return [
      {
        productId: item.productId,
        addedAt: item.addedAt,
        product,
      },
    ];
  });
};