import "server-only";

import { getMongoDb } from "@/lib/mongodb";
import type { ProductDetailDocument } from "@/types/catalog";

export const findProductDetailsByProductId = async (productId: string) => {
  const db = await getMongoDb();

  return db
    .collection<ProductDetailDocument>("productDetails")
    .findOne({ productId }, { projection: { _id: 0 } });
};