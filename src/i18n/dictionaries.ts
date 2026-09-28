import "server-only";

import { cache } from "react";

import type { Locale } from "@/i18n/config";
import type { RegionCode } from "@/utils";

import { loadMessages } from "./message-loader";

export const getDictionary = cache(async (locale: Locale, region: RegionCode) =>
  loadMessages(locale, region),
);
