import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";
import type { LocalizedProductSummary } from "@/types/catalog";
import {
  formatCurrency,
  getLocalizedProductPath,
  type CurrencyCode,
} from "@/utils";

import type { HeroCards } from "./types";

type BuildHeroCardsArgs = {
  locale: Locale;
  currency: CurrencyCode;
  fallback: {
    featuredHit: StorefrontDictionary["hero"]["featuredHit"];
    newBook: StorefrontDictionary["hero"]["newBook"];
  };
  featuredProduct?: LocalizedProductSummary;
  newBookProduct?: LocalizedProductSummary;
};

// Resolves the two product-backed cards. A linked product supplies title,
// price, and thumbnail; when a slot has no product the dictionary defaults keep
// the hero looking exactly as before.
export const buildHeroCards = ({
  locale,
  currency,
  fallback,
  featuredProduct,
  newBookProduct,
}: BuildHeroCardsArgs): HeroCards => {
  const newBookThumbnail = newBookProduct?.thumbnail;

  return {
    featured: {
      label: fallback.featuredHit.label,
      title: featuredProduct
        ? (featuredProduct.shortTitle ?? featuredProduct.title)
        : fallback.featuredHit.title,
      price: featuredProduct
        ? formatCurrency(featuredProduct.price, locale, featuredProduct.currency)
        : formatCurrency(fallback.featuredHit.price, locale, currency),
      href: featuredProduct
        ? getLocalizedProductPath(locale, featuredProduct.slug)
        : undefined,
    },
    newBook: {
      label: fallback.newBook.label,
      caption: newBookProduct ? newBookProduct.title : fallback.newBook.title,
      emoji: newBookProduct?.emoji || fallback.newBook.emoji,
      imageSrc: newBookThumbnail?.src,
      imageAlt: newBookThumbnail?.alt ?? newBookProduct?.title,
      href: newBookProduct
        ? getLocalizedProductPath(locale, newBookProduct.slug)
        : undefined,
    },
  };
};
