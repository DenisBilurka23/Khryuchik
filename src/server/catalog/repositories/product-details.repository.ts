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

export const deleteProductDetailsByProductId = async (productId: string) => {
  const db = await getMongoDb();

  return db
    .collection<ProductDetailDocument>("productDetails")
    .deleteOne({ productId });
};

export const removeProductReferencesFromDetails = async (productId: string) => {
  const db = await getMongoDb();
  const collection = db.collection<ProductDetailDocument>("productDetails");

  await Promise.all([
    collection.updateMany(
      { storyProductId: productId },
      { $unset: { storyProductId: "" } },
    ),
    collection.updateMany(
      { relatedProductIds: productId },
      { $pull: { relatedProductIds: productId } },
    ),
  ]);
};