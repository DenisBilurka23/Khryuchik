import { MongoClient } from "mongodb";

import {
  DEFAULT_REGION,
  REGION_CODES,
  REGION_DEFAULT_CURRENCY,
} from "@/constants/region";
import type { RegionCode, RegionDocument } from "@/types/localization";
import { getRegionForCountry, isRegionCode } from "@/utils/region";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("MONGODB_URI is not set");
}

if (!dbName) {
  throw new Error("MONGODB_DB is not set");
}

const isDryRun = process.argv.includes("--dry-run");

type LegacyRegionDocument = Omit<RegionDocument, "code"> & { code: string };

type LegacyProductDocument = {
  productId: string;
  availableRegions?: string[];
};

type LegacyOrderDocument = {
  id: string;
  country?: string;
  region?: string;
};

const toRegion = (code: string): RegionCode | null =>
  isRegionCode(code) ? code : getRegionForCountry(code);

const buildRegionDocuments = (
  legacy: LegacyRegionDocument[],
): RegionDocument[] => {
  const documents = REGION_CODES.flatMap((code): RegionDocument[] => {
    const current = legacy.find((region) => region.code === code);

    if (current) {
      return [{ ...current, code }];
    }

    const sources = legacy.filter((region) => toRegion(region.code) === code);

    if (sources.length === 0) {
      return [];
    }

    return [
      {
        code,
        currency: REGION_DEFAULT_CURRENCY[code],
        isActive: sources.some((region) => region.isActive),
        isDefault: sources.some((region) => region.isDefault),
        sortOrder: Math.min(...sources.map((region) => region.sortOrder)),
      },
    ];
  });

  if (documents.length > 0 && !documents.some((region) => region.isDefault)) {
    const fallback =
      documents.find((region) => region.code === DEFAULT_REGION) ??
      documents[0];

    fallback.isDefault = true;
    fallback.isActive = true;
  }

  return documents;
};

const run = async () => {
  const client = new MongoClient(uri);

  await client.connect();

  const db = client.db(dbName);
  const regionsCollection = db.collection<LegacyRegionDocument>("regions");
  const productsCollection = db.collection<LegacyProductDocument>("products");
  const ordersCollection = db.collection<LegacyOrderDocument>("orders");

  const legacyRegions = await regionsCollection
    .find({}, { projection: { _id: 0 } })
    .toArray();
  const regions = buildRegionDocuments(legacyRegions);
  const staleCodes = legacyRegions
    .map((region) => region.code)
    .filter((code) => !isRegionCode(code));

  console.log(
    `regions ${legacyRegions.map((region) => region.code).join(", ")} -> ${regions
      .map((region) => `${region.code} (${region.currency})`)
      .join(", ")}`,
  );

  if (!isDryRun) {
    for (const region of regions) {
      await regionsCollection.replaceOne({ code: region.code }, region, {
        upsert: true,
      });
    }

    if (staleCodes.length > 0) {
      await regionsCollection.deleteMany({ code: { $in: staleCodes } });
    }
  }

  const products = await productsCollection
    .find({}, { projection: { _id: 0, productId: 1, availableRegions: 1 } })
    .toArray();

  for (const product of products) {
    const current = product.availableRegions ?? [];
    const next = [
      ...new Set(
        current.flatMap((code) => {
          const region = toRegion(code);

          return region ? [region] : [];
        }),
      ),
    ];

    if (next.join(",") === current.join(",")) {
      continue;
    }

    console.log(
      `product ${product.productId}: [${current.join(", ")}] -> [${next.join(", ")}]`,
    );

    if (!isDryRun) {
      await productsCollection.updateOne(
        { productId: product.productId },
        { $set: { availableRegions: next } },
      );
    }
  }

  const orders = await ordersCollection
    .find(
      { country: { $exists: true } },
      { projection: { _id: 0, id: 1, country: 1, region: 1 } },
    )
    .toArray();

  for (const order of orders) {
    const region =
      (order.region && toRegion(order.region)) ??
      (order.country && toRegion(order.country)) ??
      DEFAULT_REGION;

    console.log(`order ${order.id}: ${order.country} -> ${region}`);

    if (!isDryRun) {
      await ordersCollection.updateOne(
        { id: order.id },
        { $set: { region }, $unset: { country: "" } },
      );
    }
  }

  await client.close();

  console.log(isDryRun ? "Dry run, nothing written." : "Done.");
};

run();
