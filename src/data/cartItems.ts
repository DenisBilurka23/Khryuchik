import type { Locale } from "@/i18n/config";
import type { CartItem } from "@/types/cart";

import { getProductDetails } from "./product-details";

const cartVariants: Record<Locale, Record<string, string>> = {
  ru: {
    "book-winter": "Русский / PDF",
    mug: "Молочный",
  },
  en: {
    "book-winter": "Russian / PDF",
    mug: "Cream",
  },
};

export const getCartItemsMock = (locale: Locale): CartItem[] => {
  const items = [
    { id: "1", slug: "book-winter", quantity: 1 },
    { id: "2", slug: "mug", quantity: 2 },
  ];

  return items.map(({ id, slug, quantity }) => {
    const product = getProductDetails(locale, slug);

    if (!product) {
      return {
        id,
        slug,
        title: slug,
        price: 0,
        emoji: "📦",
        bgColor: "#FFF8F0",
        quantity,
        variant: cartVariants[locale][slug],
      };
    }

    return {
      id,
      slug,
      title: product.title,
      price: product.price,
      emoji: product.images[0]?.emoji ?? "📦",
      bgColor: product.images[0]?.bgColor ?? "#FFF8F0",
      quantity,
      variant: cartVariants[locale][slug],
    };
  });
};