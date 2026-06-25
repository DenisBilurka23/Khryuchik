import type { CountryCode } from "@/utils";

import { defaultLocale, type Locale } from "./config";
import enDictionary from "./messages/en.json";
import ruDictionary from "./messages/ru.json";
import type { Dictionary, SeedDictionary, StorefrontDictionary } from "./types";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer Item>
    ? Item[]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

type StorefrontDictionaryOverride = DeepPartial<StorefrontDictionary>;

export const dictionariesByLocale: Record<Locale, SeedDictionary> = {
  en: enDictionary,
  ru: ruDictionary,
};

const storefrontOverrideLoaders: Partial<
  Record<
    CountryCode,
    Partial<Record<Locale, () => Promise<StorefrontDictionaryOverride>>>
  >
> = {
  US: {
    en: () =>
      import("./overrides/US/en.json").then(
        (module) => module.default as StorefrontDictionaryOverride,
      ),
    ru: () =>
      import("./overrides/US/ru.json").then(
        (module) => module.default as StorefrontDictionaryOverride,
      ),
  },
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const mergeDeep = <T extends Record<string, unknown>>(
  target: T,
  source?: DeepPartial<T>,
): T => {
  if (!source) {
    return target;
  }

  const output = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "undefined") {
      continue;
    }

    const typedKey = key as keyof T;
    const targetValue = output[typedKey];

    if (
      isPlainObject(value) &&
      isPlainObject(targetValue)
    ) {
      output[typedKey] = mergeDeep(targetValue, value as DeepPartial<typeof targetValue>);
      continue;
    }

    output[typedKey] = value as T[keyof T];
  }

  return output;
};

const buildStorefrontDictionary = async (
  locale: Locale,
  dictionary: SeedDictionary,
  country: CountryCode,
): Promise<StorefrontDictionary> => {
  const baseStorefront = {
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
      selectOptions: dictionary.storefront.shopSection.selectOptions,
      wishlistAriaLabel: dictionary.storefront.shopSection.wishlistAriaLabel,
    },
  };

  const overrideLoader = storefrontOverrideLoaders[country]?.[locale];
  const override = overrideLoader ? await overrideLoader() : undefined;

  return mergeDeep(baseStorefront, override);
};

export const loadMessages = async (
  locale: Locale,
  country: CountryCode,
): Promise<Dictionary> => {
  // Admin-managed locales may not ship a UI dictionary yet; fall back to the
  // default-locale (English) copy until a translation file is added in code.
  const dictionary =
    dictionariesByLocale[locale] ?? dictionariesByLocale[defaultLocale];

  return {
    metadata: dictionary.metadata,
    storefront: await buildStorefrontDictionary(locale, dictionary, country),
    authPage: dictionary.authPage,
    registerPage: dictionary.registerPage,
    forgotPasswordPage: dictionary.forgotPasswordPage,
    resetPasswordPage: dictionary.resetPasswordPage,
    accountPage: dictionary.accountPage,
    adminPage: dictionary.adminPage,
  };
};