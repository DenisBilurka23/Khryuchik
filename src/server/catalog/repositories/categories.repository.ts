import "server-only";

import { getMongoDb } from "@/server/db/mongodb";
import type { CategoryDocument } from "@/types/catalog";

export const findShopVisibleCategories = async () => {
  const db = await getMongoDb();

  return db
    .collection<CategoryDocument>("categories")
    .find(
      { isActive: true, visibleInShop: true },
      { projection: { _id: 0 } },
    )
    .sort({ sortOrder: 1 })
    .toArray();
};

export const findHomeTabCategories = async () => {
  const db = await getMongoDb();

  return db
    .collection<CategoryDocument>("categories")
    .find(
      { isActive: true, visibleInShop: true, visibleInHomeTabs: true },
      { projection: { _id: 0 } },
    )
    .sort({ sortOrder: 1 })
    .toArray();
};

export const findAllCategories = async () => {
  const db = await getMongoDb();

  return db
    .collection<CategoryDocument>("categories")
    .find({}, { projection: { _id: 0 } })
    .sort({ sortOrder: 1, key: 1 })
    .toArray();
};

export const upsertCategory = async (category: CategoryDocument) => {
  const db = await getMongoDb();

  await db.collection<CategoryDocument>("categories").replaceOne(
    { key: category.key },
    category,
    { upsert: true },
  );

  return category;
};

export const deleteCategoryByKey = async (key: string) => {
  const db = await getMongoDb();

  return db.collection<CategoryDocument>("categories").deleteOne({ key });
};

export const countCategories = async () => {
  const db = await getMongoDb();

  return db.collection<CategoryDocument>("categories").countDocuments();
};