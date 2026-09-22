import "server-only";

import type { Filter, UpdateFilter } from "mongodb";

import type { Locale } from "@/i18n/config";
import { getMongoDb } from "@/server/db/mongodb";
import type { ProductDocument, ProductPlacement } from "@/types/catalog";
import type { ShippingHubCode } from "@/types/shipping";
import type { CountryCode } from "@/utils";

const collectionName = "products";

let productsIndexesPromise: Promise<unknown> | null = null;

const getProductsCollection = async () => {
  const db = await getMongoDb();
  const collection = db.collection<ProductDocument>(collectionName);

  if (!productsIndexesPromise) {
    productsIndexesPromise = Promise.all([
      collection.createIndex({ productId: 1 }, { unique: true }),
      collection.createIndex({ slug: 1 }, { unique: true }),
      collection.createIndex({
        "status.isActive": 1,
        availableRegions: 1,
        "merchandising.sortOrder": 1,
      }),
      collection.createIndex({
        "status.isActive": 1,
        "status.visibleInShop": 1,
        availableRegions: 1,
        "merchandising.sortOrder": 1,
      }),
    ]).catch((error) => {
      productsIndexesPromise = null;
      throw error;
    });
  }

  return collection;
};

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
  const collection = await getProductsCollection();

  return collection.findOne(
    {
      slug,
      "status.isActive": true,
    },
    { projection: { _id: 0 } },
  );
};

export const findProductsForPlacement = async (
  placement: ProductPlacement,
  country: CountryCode,
  options?: ProductPlacementQueryOptions,
) => {
  const collection = await getProductsCollection();

  const { category, limit } = options ?? {};

  const cursor = collection
    .find(
      {
        "status.isActive": true,
        availableRegions: country,
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
  country: CountryCode,
  options?: ShopProductsQueryOptions,
) => {
  const collection = await getProductsCollection();

  const { category, limit } = options ?? {};

  const cursor = collection
    .find(
      {
        "status.isActive": true,
        "status.visibleInShop": true,
        availableRegions: country,
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

export const findSitemapProductSlugs = async (country: CountryCode) => {
  const collection = await getProductsCollection();
  const products = await collection
    .find(
      {
        "status.isActive": true,
        "status.visibleInShop": true,
        availableRegions: country,
      },
      { projection: { _id: 0, slug: 1 } },
    )
    .sort({ "merchandising.sortOrder": 1 })
    .toArray();

  return Array.from(
    new Set(
      products
        .map((product) => product.slug)
        .filter((slug): slug is string => Boolean(slug)),
    ),
  );
};

export const findCategoryKeysWithProducts = async (country: CountryCode) => {
  const collection = await getProductsCollection();

  const categoryGroups = await collection
    .aggregate<{ _id: string }>([
      {
        $match: {
          "status.isActive": true,
          "status.visibleInShop": true,
          availableRegions: country,
        },
      },
      { $group: { _id: "$classification.category" } },
    ])
    .toArray();

  return categoryGroups.map((group) => group._id);
};

export const findActiveProductsByIds = async (productIds: string[]) => {
  if (productIds.length === 0) {
    return [];
  }

  const collection = await getProductsCollection();

  return collection
    .find(
      { productId: { $in: productIds }, "status.isActive": true },
      { projection: { _id: 0 } },
    )
    .toArray();
};

export const findActiveProductSlugs = async () => {
  const collection = await getProductsCollection();
  const products = await collection
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

export const findPrintifyLinkedProductIds = async (afterProductId?: string) => {
  const collection = await getProductsCollection();
  const products = await collection
    .find(
      {
        printify: { $exists: true },
        ...(afterProductId ? { productId: { $gt: afterProductId } } : {}),
      },
      { projection: { _id: 0, productId: 1 } },
    )
    .sort({ productId: 1 })
    .toArray();

  return products.map((product) => product.productId);
};

export const findAllProducts = async () => {
  const collection = await getProductsCollection();

  return collection
    .find({}, { projection: { _id: 0 } })
    .sort({ "merchandising.sortOrder": 1, productId: 1 })
    .toArray();
};

export const findProductsByIds = async (productIds: string[]) => {
  if (productIds.length === 0) {
    return [];
  }

  const collection = await getProductsCollection();

  return collection
    .find({ productId: { $in: productIds } }, { projection: { _id: 0 } })
    .toArray();
};

export const findAdminProductsForSearch = async (
  _locale: Locale,
  options?: AdminProductSearchQueryOptions,
) => {
  const collection = await getProductsCollection();
  const query = options?.query?.trim() ?? "";
  const limit =
    typeof options?.limit === "number" && options.limit > 0
      ? options.limit
      : 10;
  const regex = query ? new RegExp(escapeRegex(query), "i") : null;

  return collection
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
  const collection = await getProductsCollection();

  return collection.findOne({ productId }, { projection: { _id: 0 } });
};

export const upsertProduct = async (product: ProductDocument) => {
  const collection = await getProductsCollection();

  await collection.replaceOne({ productId: product.productId }, product, {
    upsert: true,
  });

  return product;
};

export const deleteProductById = async (productId: string) => {
  const collection = await getProductsCollection();

  return collection.deleteOne({ productId });
};

export const countProducts = async () => {
  const collection = await getProductsCollection();

  return collection.countDocuments();
};

export const countProductsByCategoryKey = async (categoryKey: string) => {
  const collection = await getProductsCollection();

  return collection.countDocuments({
    "classification.category": categoryKey,
  });
};

export const decrementPrintedStock = async (
  productId: string,
  language: string,
  hub: ShippingHubCode,
  quantity: number,
) => {
  const collection = await getProductsCollection();
  const path = `shipping.stockByLanguage.${language}.${hub}`;
  const result = await collection.updateOne(
    { productId, [path]: { $gte: quantity } } as Filter<ProductDocument>,
    {
      $inc: { [path]: -quantity },
    } as UpdateFilter<ProductDocument>,
  );

  return result.modifiedCount > 0;
};

export const restorePrintedStock = async (
  productId: string,
  language: string,
  hub: ShippingHubCode,
  quantity: number,
) => {
  const collection = await getProductsCollection();
  const path = `shipping.stockByLanguage.${language}.${hub}`;

  await collection.updateOne(
    { productId } as Filter<ProductDocument>,
    {
      $inc: { [path]: quantity },
    } as UpdateFilter<ProductDocument>,
  );
};
