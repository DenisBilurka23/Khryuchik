import "server-only";

import { getMongoDb } from "@/lib/mongodb";
import type { CategoryDocument } from "@/types/catalog";

export const findShopVisibleCategories = async () => {
  const db = await getMongoDb();

  return db
    .collection<CategoryDocument>("categories")
    .find({ isActive: true, visibleInShop: true })
    .sort({ sortOrder: 1 })
    .toArray();
};

export const findHomeTabCategories = async () => {
  const db = await getMongoDb();

  return db
    .collection<CategoryDocument>("categories")
    .find({ isActive: true, visibleInShop: true, visibleInHomeTabs: true })
    .sort({ sortOrder: 1 })
    .toArray();
};