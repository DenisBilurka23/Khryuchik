import "server-only";

import type { Locale } from "@/i18n/config";
import { getMongoDb } from "@/server/db/mongodb";
import type { ProductDocument, ProductPlacement } from "@/types/catalog";

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export type ProductPlacementQueryOptions = {
  category?: string;
  limit?: number;
};

export type ShopProductsQueryOptions = {
  category?: string;
  limit?: number;
};

export type AdminProductSearchQueryOptions = {
  query?: string;
  limit?: number;
  excludeProductId?: string;
};

export const findActiveProductBySlug = async (
  _locale: Locale,
  slug: string,
) => {
  const db = await getMongoDb();

  return db.collection<ProductDocument>("products").findOne(
    {
      slug,
      "status.isActive": true,
    },
    { projection: { _id: 0 } },
  );
};

export const findProductsForPlacement = async (
  placement: ProductPlacement,
  options?: ProductPlacementQueryOptions,
) => {
  const db = await getMongoDb();

  const { category, limit } = options ?? {};

  const cursor = db
    .collection<ProductDocument>("products")
    .find(
      {
        "status.isActive": true,
        ...(placement === "shop"
          ? { "status.visibleInShop": true }
          : {
              "status.visibleOnHome": true,
              "classification.type":
                placement === "home-books" ? "book" : "merch",
            }),
        ...(category ? { "classification.category": category } : {}),
      },
      { projection: { _id: 0 } },
    )
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
    .find(
      {
        "status.isActive": true,
        "status.visibleInShop": true,
        ...(category ? { "classification.category": category } : {}),
      },
      { projection: { _id: 0 } },
    )
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
    .find(
      { productId: { $in: productIds }, "status.isActive": true },
      { projection: { _id: 0 } },
    )
    .toArray();
};

export const findActiveProductSlugs = async () => {
  const db = await getMongoDb();
  const products = await db
    .collection<ProductDocument>("products")
    .find({ "status.isActive": true }, { projection: { _id: 0, slug: 1 } })
    .toArray();

  return Array.from(
    new Set(
      products
        .map((product) => product.slug)
        .filter((slug): slug is string => Boolean(slug)),
    ),
  );
};

export const findAllProducts = async () => {
  const db = await getMongoDb();

  return db
    .collection<ProductDocument>("products")
    .find({}, { projection: { _id: 0 } })
    .sort({ "merchandising.sortOrder": 1, productId: 1 })
    .toArray();
};

export const findProductsByIds = async (productIds: string[]) => {
  if (productIds.length === 0) {
    return [];
  }

  const db = await getMongoDb();

  return db
    .collection<ProductDocument>("products")
    .find(
      { productId: { $in: productIds } },
      { projection: { _id: 0 } },
    )
    .toArray();
};

export const findAdminProductsForSearch = async (
  _locale: Locale,
  options?: AdminProductSearchQueryOptions,
) => {
  const db = await getMongoDb();
  const query = options?.query?.trim() ?? "";
  const limit =
    typeof options?.limit === "number" && options.limit > 0
      ? options.limit
      : 10;
  const regex = query ? new RegExp(escapeRegex(query), "i") : null;

  return db
    .collection<ProductDocument>("products")
    .find(
      {
        ...(options?.excludeProductId
          ? { productId: { $ne: options.excludeProductId } }
          : {}),
        ...(regex
          ? {
              $or: [
                { productId: regex },
                { slug: regex },
                { "translations.ru.title": regex },
                { "translations.en.title": regex },
              ],
            }
          : {}),
      },
      { projection: { _id: 0 } },
    )
    .sort({ "merchandising.sortOrder": 1, productId: 1 })
    .limit(limit)
    .toArray();
};

export const findProductById = async (productId: string) => {
  const db = await getMongoDb();

  return db
    .collection<ProductDocument>("products")
    .findOne({ productId }, { projection: { _id: 0 } });
};

export const upsertProduct = async (product: ProductDocument) => {
  const db = await getMongoDb();

  await db
    .collection<ProductDocument>("products")
    .replaceOne({ productId: product.productId }, product, { upsert: true });

  return product;
};

export const deleteProductById = async (productId: string) => {
  const db = await getMongoDb();

  return db.collection<ProductDocument>("products").deleteOne({ productId });
};

export const countProducts = async () => {
  const db = await getMongoDb();

  return db.collection<ProductDocument>("products").countDocuments();
};

export const countProductsByCategoryKey = async (categoryKey: string) => {
  const db = await getMongoDb();

  return db.collection<ProductDocument>("products").countDocuments({
    "classification.category": categoryKey,
  });
};
