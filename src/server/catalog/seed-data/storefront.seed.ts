import type { Locale } from "@/i18n/config";
import type { SeedStorefrontBook, SeedStorefrontProduct } from "@/i18n/types";

const storefrontBooksByLocale: Record<Locale, SeedStorefrontBook[]> = {
  ru: [
    {
      slug: "book-winter",
      title: "Хрючик зимой",
      lang: "RU / EN",
      desc: "Тёплая история о зимних приключениях Хрючика.",
      emoji: "📘",
    },
    {
      slug: "book-country-house",
      title: "Хрючик на даче",
      lang: "RU / EN",
      desc: "Весёлая сказка, вдохновлённая семейными воспоминаниями.",
      emoji: "📚",
    },
    {
      slug: "book-friends",
      title: "Хрючик и друзья",
      lang: "RU / EN",
      desc: "Добрая история о дружбе, заботе и маленьких открытиях.",
      emoji: "📚",
    },
  ],
  en: [
    {
      slug: "book-winter",
      title: "Khryuchik in Winter",
      lang: "RU / EN",
      desc: "A warm story about Khryuchik's winter adventures.",
      emoji: "📘",
    },
    {
      slug: "book-country-house",
      title: "Khryuchik at the Country House",
      lang: "RU / EN",
      desc: "A cheerful tale inspired by real family memories.",
      emoji: "📚",
    },
    {
      slug: "book-friends",
      title: "Khryuchik and Friends",
      lang: "RU / EN",
      desc: "A kind story about friendship, care, and small discoveries.",
      emoji: "📚",
    },
  ],
};

const storefrontProductsByLocale: Record<Locale, SeedStorefrontProduct[]> = {
  ru: [
    {
      id: "book-winter",
      title: "Книга «Хрючик зимой»",
      price: 29,
      emoji: "📘",
      category: "Все",
    },
    {
      id: "mug",
      title: "Кружка Хрючик",
      price: 24,
      emoji: "☕",
      category: "Подарки",
    },
    {
      id: "tshirt",
      title: "Футболка Хрючик",
      price: 49,
      emoji: "👕",
      category: "Одежда",
    },
    {
      id: "stickers",
      title: "Наклейки Хрючик",
      price: 12,
      emoji: "✨",
      category: "Подарки",
    },
  ],
  en: [
    {
      id: "book-winter",
      title: "Book 'Khryuchik in Winter'",
      price: 29,
      emoji: "📘",
      category: "All",
    },
    {
      id: "mug",
      title: "Khryuchik mug",
      price: 24,
      emoji: "☕",
      category: "Gifts",
    },
    {
      id: "tshirt",
      title: "Khryuchik T-shirt",
      price: 49,
      emoji: "👕",
      category: "Apparel",
    },
    {
      id: "stickers",
      title: "Khryuchik stickers",
      price: 12,
      emoji: "✨",
      category: "Gifts",
    },
  ],
};

export const getStorefrontBookSeedItems = (locale: Locale) =>
  storefrontBooksByLocale[locale];

export const getStorefrontProductSeedItems = (locale: Locale) =>
  storefrontProductsByLocale[locale];