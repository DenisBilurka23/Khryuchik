import "server-only";

import { notFound } from "next/navigation";

import { defaultLocale, type Locale } from "@/i18n/config";
import { isActiveLocale } from "@/server/localization/localization.service";

export const requireActiveLocale = async (lang: string): Promise<Locale> => {
  if (lang === defaultLocale) {
    return lang;
  }

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  return lang;
};
