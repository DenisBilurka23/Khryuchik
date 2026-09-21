import type { MetadataRoute } from "next";

import type { SitemapChangeFrequency } from "@/constants/seo";
import { defaultLocale, locales } from "@/i18n/config";

import { getLocalizedPath } from "./localized-path";

type SitemapEntryInput = {
  origin: string;
  path: string;
  changeFrequency: SitemapChangeFrequency;
  priority: number;
  lastModified?: string | Date;
};

export const normalizeOrigin = (origin: string) => origin.replace(/\/+$/, "");

export const createSitemapEntry = ({
  origin,
  path,
  changeFrequency,
  priority,
  lastModified,
}: SitemapEntryInput): MetadataRoute.Sitemap[number] => {
  const base = normalizeOrigin(origin);

  return {
    url: `${base}${getLocalizedPath(defaultLocale, path)}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          `${base}${getLocalizedPath(locale, path)}`,
        ]),
      ),
    },
  };
};

export const createRobotsDisallowList = (
  storefrontPaths: readonly string[],
  sharedPaths: readonly string[],
) => [
  ...new Set([
    ...storefrontPaths.flatMap((path) =>
      locales.map((locale) => getLocalizedPath(locale, path)),
    ),
    ...sharedPaths,
  ]),
];
