import "server-only";

import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("MONGODB_URI is not set");
}

if (!dbName) {
  throw new Error("MONGODB_DB is not set");
}

declare global {
  var __khryuchikMongoClient: MongoClient | undefined;
}

const client =
  global.__khryuchikMongoClient ??
  new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.__khryuchikMongoClient = client;
}

export const getMongoDb = async () => {
  await client.connect();

  return client.db(dbName);
};
