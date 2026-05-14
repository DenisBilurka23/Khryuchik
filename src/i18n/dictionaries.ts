import "server-only";

import { cache } from "react";

import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/utils";

import { loadMessages } from "./message-loader";

export const getDictionary = cache(async (locale: Locale, country: CountryCode) =>
  loadMessages(locale, country),
);
