import type { ProductDetailDocument, ProductDocument } from "@/types/catalog";
import { ObjectId, type WithId } from "mongodb";

export const jetprintProduct = (
  overrides: Partial<ProductDocument> = {},
): WithId<ProductDocument> => ({
  _id: new ObjectId("000000000000000000000001"),
  productId: "bag",
  slug: "bag",
  classification: { type: "merch", category: "bags" },
  status: {
    isActive: true,
    visibleInShop: true,
    visibleOnHome: false,
    notifySubscribers: false,
  },
  merchandising: { sortOrder: 1 },
  inventory: { availability: "made_to_order", quantity: null },
  pricing: { USD: { price: 30 } },
  availableRegions: ["europe"],
  translations: {
    en: {
      title: "Bag",
      subtitle: "School bag",
      emoji: "bag",
      price: 30,
      currency: "USD",
    },
  },
  jetprint: {
    variants: [{ sku: "D42-Default", selections: {}, isAvailable: true }],
    printFiles: [{ name: "print", url: "https://cdn.test/print.png" }],
    previewFiles: [{ name: "preview", url: "https://cdn.test/old.png" }],
  },
  ...overrides,
});

export const jetprintDetails = (): WithId<ProductDetailDocument> => ({
  _id: new ObjectId("000000000000000000000002"),
  productId: "bag",
  sku: "bag",
  relatedProductIds: [],
  translations: {
    en: {
      description: "Description",
      images: [
        { id: "old", src: "https://cdn.test/old.png", objectKey: "old-key" },
        {
          id: "unused",
          src: "https://cdn.test/unused.png",
          objectKey: "unused-key",
        },
      ],
      specs: [],
      delivery: [],
      reviews: [],
    },
  },
});
