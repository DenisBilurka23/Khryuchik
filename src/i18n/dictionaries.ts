import "server-only";

import { cache } from "react";

import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/shared/countries";

import { buildRuntimeDictionary, dictionariesByLocale } from "./runtime-dictionaries";

export const getDictionary = cache(async (locale: Locale, country: CountryCode) =>
	buildRuntimeDictionary(locale, dictionariesByLocale[locale], country),
);
