import "server-only";

import type { Locale } from "@/i18n/config";
import { getMongoDb } from "@/server/db/mongodb";
import type { ProductDocument, ProductPlacement } from "@/types/catalog";

export type ProductPlacementQueryOptions = {
  category?: string;
  limit?: number;
};

export type ShopProductsQueryOptions = {
  category?: string;
  limit?: number;
};

export const findActiveProductBySlug = async (
  locale: Locale,
  slug: string,
) => {
  const db = await getMongoDb();

  return db.collection<ProductDocument>("products").findOne({
    [`translations.${locale}.slug`]: slug,
    "status.isActive": true,
  });
};

export const findProductsForPlacement = async (
  placement: ProductPlacement,
  options?: ProductPlacementQueryOptions,
) => {
  const db = await getMongoDb();

  const { category, limit } = options ?? {};

  const cursor = db
    .collection<ProductDocument>("products")
    .find({
      "merchandising.placements": placement,
      "status.isActive": true,
      ...(placement === "shop"
        ? { "status.visibleInShop": true }
        : { "status.visibleOnHome": true }),
      ...(category ? { "classification.category": category } : {}),
    })
    .sort({ "merchandising.sortOrder": 1 });

  if (typeof limit === "number" && limit > 0) {
    cursor.limit(limit);
  }

  return cursor.toArray();
};

export const findShopVisibleProducts = async (
  options?: ShopProductsQueryOptions,
) => {
  const db = await getMongoDb();

  const { category, limit } = options ?? {};

  const cursor = db
    .collection<ProductDocument>("products")
    .find({
      "merchandising.placements": "shop",
      "status.isActive": true,
      "status.visibleInShop": true,
      ...(category ? { "classification.category": category } : {}),
    })
    .sort({ "merchandising.sortOrder": 1 });

  if (typeof limit === "number" && limit > 0) {
    cursor.limit(limit);
  }

  return cursor.toArray();
};

export const findActiveProductsByIds = async (productIds: string[]) => {
  if (productIds.length === 0) {
    return [];
  }

  const db = await getMongoDb();

  return db
    .collection<ProductDocument>("products")
    .find({ productId: { $in: productIds }, "status.isActive": true })
    .toArray();
};

export const findActiveProductSlugs = async (locale: Locale) => {
  const db = await getMongoDb();
  const products = await db
    .collection<ProductDocument>("products")
    .find(
      { "status.isActive": true },
      { projection: { _id: 0, translations: 1 } },
    )
    .toArray();

  return Array.from(
    new Set(
      products
        .map((product) => product.translations[locale]?.slug)
        .filter((slug): slug is string => Boolean(slug)),
    ),
  );
};

export const findAllProducts = async () => {
  const db = await getMongoDb();

  return db
    .collection<ProductDocument>("products")
    .find({})
    .sort({ "merchandising.sortOrder": 1, productId: 1 })
    .toArray();
};

export const findProductById = async (productId: string) => {
  const db = await getMongoDb();

  return db.collection<ProductDocument>("products").findOne({ productId });
};

export const upsertProduct = async (product: ProductDocument) => {
  const db = await getMongoDb();

  await db.collection<ProductDocument>("products").replaceOne(
    { productId: product.productId },
    product,
    { upsert: true },
  );

  return product;
};

export const countProducts = async () => {
  const db = await getMongoDb();

  return db.collection<ProductDocument>("products").countDocuments();
};