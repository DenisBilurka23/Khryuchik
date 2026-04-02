import type { CountryCode } from "@/utils";

import type { Locale } from "./config";
import type { StorefrontDictionary } from "./types";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer Item>
    ? Item[]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

export type StorefrontDictionaryOverride = DeepPartial<StorefrontDictionary>;

export const countryStorefrontOverrides: Partial<
  Record<CountryCode, Partial<Record<Locale, StorefrontDictionaryOverride>>>
> = {
  US: {
    ru: {
      hero: {
        chips: [
          "📦 Доставка по США и в другие страны",
          "🌍 RU / EN версия сайта",
          "🎁 Подарочные наборы",
        ],
        featuredHit: {
          price: 9,
        },
      },
      cartPage: {
        summary: {
          infoText:
            "PDF-книги отправляются после оплаты, а физические товары доставляются по США и в другие страны.",
        },
      },
    },
    en: {
      hero: {
        chips: [
          "📦 Shipping across the USA and internationally",
          "🌍 RU / EN website versions",
          "🎁 Ready-made gift sets",
        ],
        featuredHit: {
          price: 9,
        },
      },
      cartPage: {
        summary: {
          infoText:
            "PDF books are delivered after payment, while physical products can be shipped across the USA and internationally.",
        },
      },
    },
  },
};