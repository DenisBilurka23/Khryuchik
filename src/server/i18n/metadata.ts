import "server-only";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/utils";

type StorefrontOpenGraphInput = {
  type?: "website" | "video.other";
  title?: string;
  images?: { url: string }[];
};

type StorefrontMetadataInput = {
  locale: Locale;
  path: string;
  title: string;
  description?: string;
  openGraph?: StorefrontOpenGraphInput;
};

const toAlternatePath = (locale: Locale, path: string) => {
  if (path !== "/") {
    return getLocalizedPath(locale, path);
  }

  return locale === defaultLocale ? "/" : `/${locale}`;
};

export const createStorefrontAlternates = (
  locale: Locale,
  path: string,
): Metadata["alternates"] => ({
  canonical: toAlternatePath(locale, path),
  languages: Object.fromEntries(
    locales.map((code) => [code, toAlternatePath(code, path)]),
  ),
});

export const createStorefrontMetadata = async ({
  locale,
  path,
  title,
  description,
  openGraph,
}: StorefrontMetadataInput): Promise<Metadata> => {
  const tBrand = await getTranslations({
    locale,
    namespace: "storefront.brand",
  });

  return {
    title,
    description,
    alternates: createStorefrontAlternates(locale, path),
    openGraph: {
      type: openGraph?.type ?? "website",
      locale,
      title: openGraph?.title ?? title,
      description,
      siteName: tBrand("title"),
      images: openGraph?.images,
    },
  };
};
