import "server-only";

import { cache } from "react";

import type { Locale } from "@/i18n/config";

import { buildRuntimeDictionary, dictionariesByLocale } from "./runtime-dictionaries";

export const getDictionary = cache(async (locale: Locale) =>
	buildRuntimeDictionary(dictionariesByLocale[locale]),
);
