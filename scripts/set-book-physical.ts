import { MongoClient } from "mongodb";

import { DEFAULT_BOOK_SHIPPING } from "@/constants/shipping";
import type { ProductDocument } from "@/types/catalog";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("MONGODB_URI is not set");
}

if (!dbName) {
  throw new Error("MONGODB_DB is not set");
}

const isOverwriting = process.argv.includes("--overwrite");

const run = async () => {
  const client = new MongoClient(uri);

  await client.connect();

  const collection = client.db(dbName).collection<ProductDocument>("products");

  const books = await collection
    .find({ "classification.type": "book" })
    .toArray();

  for (const book of books) {
    if (book.shipping && !isOverwriting) {
      console.log(`skip   ${book.productId} (already has shipping)`);
      continue;
    }

    await collection.updateOne(
      { productId: book.productId },
      { $set: { shipping: DEFAULT_BOOK_SHIPPING } },
    );

    console.log(
      `set    ${book.productId} → ${DEFAULT_BOOK_SHIPPING.weightGrams} g, ` +
        `${DEFAULT_BOOK_SHIPPING.lengthMm}×${DEFAULT_BOOK_SHIPPING.widthMm}×${DEFAULT_BOOK_SHIPPING.heightMm} mm`,
    );
  }

  await client.close();
};

run();
