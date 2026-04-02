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
  var __khryuchikMongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const clientPromise =
  global.__khryuchikMongoClientPromise ?? client.connect();

if (process.env.NODE_ENV !== "production") {
  global.__khryuchikMongoClientPromise = clientPromise;
}

export const getMongoDb = async () => {
  const connectedClient = await clientPromise;

  return connectedClient.db(dbName);
};