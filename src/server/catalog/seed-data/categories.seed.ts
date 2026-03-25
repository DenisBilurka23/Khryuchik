import type { CategoryDocument } from "@/types/catalog";

export const categorySeedDocuments: CategoryDocument[] = [
  {
    key: "books",
    isActive: true,
    visibleInShop: true,
    visibleInHomeTabs: false,
    sortOrder: 1,
    translations: {
      ru: { label: "Книги" },
      en: { label: "Books" },
    },
  },
  {
    key: "clothes",
    isActive: true,
    visibleInShop: true,
    visibleInHomeTabs: true,
    sortOrder: 2,
    translations: {
      ru: { label: "Одежда" },
      en: { label: "Apparel" },
    },
  },
  {
    key: "gifts",
    isActive: true,
    visibleInShop: true,
    visibleInHomeTabs: true,
    sortOrder: 3,
    translations: {
      ru: { label: "Подарки" },
      en: { label: "Gifts" },
    },
  },
];