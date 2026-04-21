import "server-only";

import { getMongoDb } from "@/server/db/mongodb";
import type { ProductDetailDocument } from "@/types/catalog";

export const findProductDetailsByProductId = async (productId: string) => {
  const db = await getMongoDb();

  return db
    .collection<ProductDetailDocument>("productDetails")
    .findOne({ productId }, { projection: { _id: 0 } });
};

export const findAllProductDetails = async () => {
  const db = await getMongoDb();

  return db
    .collection<ProductDetailDocument>("productDetails")
    .find({}, { projection: { _id: 0 } })
    .toArray();
};

export const upsertProductDetails = async (details: ProductDetailDocument) => {
  const db = await getMongoDb();

  await db.collection<ProductDetailDocument>("productDetails").replaceOne(
    { productId: details.productId },
    details,
    { upsert: true },
  );

  return details;
};