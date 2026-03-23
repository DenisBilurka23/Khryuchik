import "server-only";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

const dictionaries = {
  en: () => import("./locales/en").then((module) => module.default),
  ru: () => import("./locales/ru").then((module) => module.default),
} satisfies Record<Locale, () => Promise<Dictionary>>;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
