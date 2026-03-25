import type { Locale } from "@/i18n/config";
import type { Dictionary, SeedDictionary } from "@/i18n/types";

import enDictionary from "./locales/en";
import ruDictionary from "./locales/ru";

export const dictionariesByLocale: Record<Locale, SeedDictionary> = {
  en: enDictionary,
  ru: ruDictionary,
};

export const buildRuntimeDictionary = (dictionary: SeedDictionary): Dictionary => ({
  metadata: dictionary.metadata,
  storefront: {
    ...dictionary.storefront,
    booksSection: {
      eyebrow: dictionary.storefront.booksSection.eyebrow,
      title: dictionary.storefront.booksSection.title,
      actionLabel: dictionary.storefront.booksSection.actionLabel,
      detailsButton: dictionary.storefront.booksSection.detailsButton,
      buyButton: dictionary.storefront.booksSection.buyButton,
    },
    shopSection: {
      eyebrow: dictionary.storefront.shopSection.eyebrow,
      title: dictionary.storefront.shopSection.title,
      actionLabel: dictionary.storefront.shopSection.actionLabel,
      addToCart: dictionary.storefront.shopSection.addToCart,
      wishlistAriaLabel: dictionary.storefront.shopSection.wishlistAriaLabel,
    },
  },
});