import { MongoClient } from "mongodb";

import { entertainmentSeedDocuments } from "@/server/entertainment/seed-data/entertainment.seed";
import type { EntertainmentItemDocument } from "@/types/entertainment";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("MONGODB_URI is not set");
}

if (!dbName) {
  throw new Error("MONGODB_DB is not set");
}

const main = async () => {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const collection = client
      .db(dbName)
      .collection<EntertainmentItemDocument>("entertainment");

    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ category: 1, sortOrder: 1 });

    await Promise.all(
      entertainmentSeedDocuments.map((item) =>
        collection.replaceOne({ slug: item.slug }, item, { upsert: true }),
      ),
    );

    console.log(
      `Seeded ${entertainmentSeedDocuments.length} entertainment items into "${dbName}".`,
    );
  } finally {
    await client.close();
  }
};

main().catch((error: unknown) => {
  console.error("Failed to seed entertainment", error);
  process.exitCode = 1;
});
