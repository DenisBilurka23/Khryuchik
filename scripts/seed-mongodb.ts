import { MongoClient } from "mongodb";

import {
  getProductDetails,
  getProductSlugs,
} from "@/server/catalog/seed-data/product-details.seed";
import { categorySeedDocuments } from "@/server/catalog/seed-data/categories.seed";
import { type Locale, locales } from "@/i18n/config";
import { dictionariesByLocale } from "@/i18n/runtime-dictionaries";
import type {
  CategoryDocument,
  ProductCategory,
  ProductDetailDocument,
  ProductDocument,
  ProductPlacement,
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

const getProductType = (productId: string): ProductType =>
  productCategoryById[productId] === "books" ? "book" : "merch";

const getProductSortOrder = (productId: string) => {
  const index = productOrder.indexOf(productId);

  return index === -1 ? productOrder.length + 1 : index + 1;
};

const getRequiredProductDetails = (locale: Locale, slug: string) => {
  const product = getProductDetails(locale, slug);

  if (!product) {
    throw new Error(
      `Product details for locale "${locale}" and slug "${slug}" were not found`,
    );
  }

  return product;
};

const buildProductPlacements = (productId: string): ProductPlacement[] => {
  const placements = new Set<ProductPlacement>(["shop"]);

  for (const locale of locales) {
    const dictionary = dictionariesByLocale[locale].storefront;

    if (dictionary.booksSection.items.some((book) => book.slug === productId)) {
      placements.add("home-books");
    }

    if (
      dictionary.shopSection.items.some((product) => product.id === productId)
    ) {
      placements.add("home-shop");
    }
  }

  return Array.from(placements);
};

const buildProductDocument = (productId: string): ProductDocument => ({
  productId,
  classification: {
    type: getProductType(productId),
    category: productCategoryById[productId],
  },
  status: {
    isActive: true,
    visibleInShop: true,
    visibleOnHome: true,
    visibleInSearch: true,
  },
  merchandising: {
    featured: productId === "book-winter" || productId === "mug",
    sortOrder: getProductSortOrder(productId),
    placements: buildProductPlacements(productId),
    flags:
      productId === "book-winter"
        ? ["new", "signature-story"]
        : productId === "mug"
          ? ["featured", "giftable"]
          : getProductType(productId) === "book"
            ? ["editorial"]
            : ["merch"],
  },
  inventory: {
    trackQuantity: getProductType(productId) !== "book",
    quantity: getProductType(productId) === "book" ? null : 25,
    allowBackorder: getProductType(productId) === "book",
    availability: "in_stock",
  },
  translations: Object.fromEntries(
    locales.map((locale) => {
      const dictionary = dictionariesByLocale[locale].storefront;
      const bookItem = dictionary.booksSection.items.find(
        (book) => book.slug === productId,
      );
      const details = getRequiredProductDetails(locale, productId);

      return [
        locale,
        {
          slug: details.slug,
          title: details.title,
          shortTitle:
            bookItem && bookItem.title !== details.title
              ? bookItem.title
              : undefined,
          shortDescription: bookItem?.desc ?? details.subtitle,
          price: details.price,
          currency: "BYN" as const,
          emoji: bookItem?.emoji ?? details.images[0]?.emoji ?? "📦",
          bgColor: details.images[0]?.bgColor,
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
        sku: details.sku,
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

  await Promise.all(
    locales.map(async (locale) => {
      await collection.createIndex(
        { [`translations.${locale}.slug`]: 1 },
        { unique: true },
      );
    }),
  );

  const productIds = getProductSlugs();

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

  const productIds = getProductSlugs();

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
