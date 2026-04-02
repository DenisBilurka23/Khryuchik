import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/shared/countries";
import type { Dictionary, SeedDictionary } from "@/i18n/types";

import { countryStorefrontOverrides } from "./country-overrides";
import enDictionary from "./locales/en";
import ruDictionary from "./locales/ru";

export const dictionariesByLocale: Record<Locale, SeedDictionary> = {
  en: enDictionary,
  ru: ruDictionary,
};

const mergeDeep = (
  target: Record<string, unknown>,
  source?: Record<string, unknown>,
): Record<string, unknown> => {
  if (!source) {
    return target;
  }

  const output = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "undefined") {
      continue;
    }

    const targetValue = output[key];

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      targetValue &&
      typeof targetValue === "object" &&
      !Array.isArray(targetValue)
    ) {
      output[key] = mergeDeep(
        targetValue as Record<string, unknown>,
        value as Record<string, unknown>,
      );
      continue;
    }

    output[key] = value;
  }

  return output;
};

export const buildRuntimeDictionary = (
  locale: Locale,
  dictionary: SeedDictionary,
  country: CountryCode,
): Dictionary => {
  const storefront = {
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
  };

  return {
    metadata: dictionary.metadata,
    storefront: mergeDeep(
      storefront as unknown as Record<string, unknown>,
      countryStorefrontOverrides[country]?.[locale] as
        | Record<string, unknown>
        | undefined,
    ) as Dictionary["storefront"],
    authPage: dictionary.authPage,
    registerPage: dictionary.registerPage,
    forgotPasswordPage: dictionary.forgotPasswordPage,
    resetPasswordPage: dictionary.resetPasswordPage,
    accountPage: dictionary.accountPage,
  };
};