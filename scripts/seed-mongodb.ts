import { MongoClient } from "mongodb";

import {
  getSeedProductDetails,
  getSeedProductIds,
  getSeedProductSku,
  getSeedProductSlug,
} from "@/server/catalog/seed-data/product-details.seed";
import {
  getStorefrontBookSeedItems,
} from "@/server/catalog/seed-data/storefront.seed";
import { categorySeedDocuments } from "@/server/catalog/seed-data/categories.seed";
import { type Locale, locales } from "@/i18n/config";
import type { CountryCode } from "@/utils";
import type {
  CategoryDocument,
  ProductCategory,
  ProductDetailDocument,
  ProductDocument,
  ProductCountryPricing,
  ProductType,
} from "@/types/catalog";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("MONGODB_URI is not set");
}

if (!dbName) {
  throw new Error("MONGODB_DB is not set");
}

const productOrder = [
  "book-winter",
  "book-country-house",
  "book-friends",
  "mug",
  "tshirt",
  "stickers",
];

const productCategoryById: Record<string, ProductCategory> = {
  "book-winter": "books",
  "book-country-house": "books",
  "book-friends": "books",
  mug: "gifts",
  tshirt: "clothes",
  stickers: "gifts",
};

const productPricingByCountry: Record<
  string,
  Record<CountryCode, ProductCountryPricing>
> = {
  "book-winter": {
    BY: { price: 29, currency: "BYN" },
    US: { price: 12, currency: "USD" },
  },
  "book-country-house": {
    BY: { price: 27, currency: "BYN" },
    US: { price: 11, currency: "USD" },
  },
  "book-friends": {
    BY: { price: 27, currency: "BYN" },
    US: { price: 11, currency: "USD" },
  },
  mug: {
    BY: { price: 24, currency: "BYN", oldPrice: 29 },
    US: { price: 9, currency: "USD", oldPrice: 11 },
  },
  tshirt: {
    BY: { price: 49, currency: "BYN" },
    US: { price: 18, currency: "USD" },
  },
  stickers: {
    BY: { price: 12, currency: "BYN" },
    US: { price: 5, currency: "USD" },
  },
};

const getProductType = (productId: string): ProductType =>
  productCategoryById[productId] === "books" ? "book" : "merch";

const getProductSortOrder = (productId: string) => {
  const index = productOrder.indexOf(productId);

  return index === -1 ? productOrder.length + 1 : index + 1;
};

const getRequiredProductDetails = (locale: Locale, productId: string) => {
  const product = getSeedProductDetails(locale, productId);

  if (!product) {
    throw new Error(
      `Product details for locale "${locale}" and product "${productId}" were not found`,
    );
  }

  return product;
};

const getRequiredProductSlug = (productId: string) => {
  const slug = getSeedProductSlug(productId);

  if (!slug) {
    throw new Error(`Shared slug for product "${productId}" was not found`);
  }

  return slug;
};

const getRequiredProductSku = (productId: string) => {
  const sku = getSeedProductSku(productId);

  if (!sku) {
    throw new Error(`Shared SKU for product "${productId}" was not found`);
  }

  return sku;
};

const buildProductDocument = (productId: string): ProductDocument => ({
  productId,
  slug: getRequiredProductSlug(productId),
  classification: {
    type: getProductType(productId),
    category: productCategoryById[productId],
  },
  status: {
    isActive: true,
    visibleInShop: true,
    visibleOnHome: true,
  },
  merchandising: {
    sortOrder: getProductSortOrder(productId),
  },
  inventory: {
    quantity: getProductType(productId) === "book" ? null : 25,
    availability: "in_stock",
  },
  pricing: productPricingByCountry[productId],
  translations: Object.fromEntries(
    locales.map((locale) => {
      const bookItem = getStorefrontBookSeedItems(locale).find(
        (book) => book.slug === productId,
      );
      const details = getRequiredProductDetails(locale, productId);

      return [
        locale,
        {
          title: details.title,
          shortTitle:
            bookItem && bookItem.title !== details.title
              ? bookItem.title
              : undefined,
          shortDescription: bookItem?.desc ?? details.subtitle,
          price: details.price,
          currency: "BYN" as const,
          emoji: bookItem?.emoji ?? details.images[0]?.emoji ?? "📦",
          thumbnailBackgroundColor: details.images[0]?.bgColor,
          lang: bookItem?.lang,
        },
      ];
    }),
  ) as ProductDocument["translations"],
});

const buildProductDetailDocument = (
  productId: string,
): ProductDetailDocument => ({
  productId,
  sku: getRequiredProductSku(productId),
  relatedProductIds: getRequiredProductDetails("ru", productId).relatedIds,
  translations: Object.fromEntries(
    locales.map((locale) => {
      const details = getRequiredProductDetails(locale, productId);
      const translation = {
        subtitle: details.subtitle,
        oldPrice: details.oldPrice,
        badge: details.badge,
        storyLabel: details.storyLabel,
        storyTitle: details.storyTitle,
        description: details.description,
        images: details.images,
        languages: details.languages,
        formats: details.formats,
        sizes: details.sizes,
        colors: details.colors,
        specs: details.specs,
        delivery: details.delivery,
        reviews: details.reviews,
      };

      return [locale, translation];
    }),
  ) as ProductDetailDocument["translations"],
});

const dropCollectionIfExists = async (
  client: MongoClient,
  collectionName: string,
) => {
  const db = client.db(dbName);
  const collections = await db
    .listCollections({ name: collectionName }, { nameOnly: true })
    .toArray();

  if (collections.length > 0) {
    await db.collection(collectionName).drop();
  }
};

const seedProducts = async (client: MongoClient) => {
  await dropCollectionIfExists(client, "products");

  const collection = client.db(dbName).collection<ProductDocument>("products");

  await collection.createIndex({ productId: 1 }, { unique: true });
  await collection.createIndex({ "status.isActive": 1 });
  await collection.createIndex({ "status.visibleInShop": 1 });
  await collection.createIndex({ "status.visibleOnHome": 1 });
  await collection.createIndex({ "merchandising.featured": 1 });
  await collection.createIndex({ "merchandising.sortOrder": 1 });
  await collection.createIndex({
    "merchandising.placements": 1,
    "status.isActive": 1,
  });
  await collection.createIndex({ "inventory.availability": 1 });
  await collection.createIndex({ slug: 1 }, { unique: true });

  const productIds = getSeedProductIds();

  await Promise.all(
    productIds.map(async (productId) => {
      await collection.replaceOne(
        { productId },
        buildProductDocument(productId),
        { upsert: true },
      );
    }),
  );
};

const seedCategories = async (client: MongoClient) => {
  await dropCollectionIfExists(client, "categories");

  const collection = client
    .db(dbName)
    .collection<CategoryDocument>("categories");

  await collection.createIndex({ key: 1 }, { unique: true });
  await collection.createIndex({
    isActive: 1,
    visibleInShop: 1,
    visibleInHomeTabs: 1,
    sortOrder: 1,
  });

  await Promise.all(
    categorySeedDocuments.map(async (category) => {
      await collection.replaceOne({ key: category.key }, category, {
        upsert: true,
      });
    }),
  );
};

const seedProductDetails = async (client: MongoClient) => {
  await dropCollectionIfExists(client, "productDetails");

  const collection = client
    .db(dbName)
    .collection<ProductDetailDocument>("productDetails");

  await collection.createIndex({ productId: 1 }, { unique: true });
  await collection.createIndex({ sku: 1 }, { unique: true });

  const productIds = getSeedProductIds();

  await Promise.all(
    productIds.map(async (productId) => {
      await collection.replaceOne(
        { productId },
        buildProductDetailDocument(productId),
        { upsert: true },
      );
    }),
  );
};

const main = async () => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    await dropCollectionIfExists(client, "dictionaries");
    await seedCategories(client);
    await seedProducts(client);
    await seedProductDetails(client);
    console.log(`Seeded MongoDB database "${dbName}" successfully.`);
  } finally {
    await client.close();
  }
};

main().catch((error: unknown) => {
  console.error("Failed to seed MongoDB", error);
  process.exitCode = 1;
});
