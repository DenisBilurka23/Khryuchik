import "server-only";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { NOINDEX_ROBOTS } from "@/constants/seo";
import { locales, type Locale } from "@/i18n/config";
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
  noindex?: boolean;
  openGraph?: StorefrontOpenGraphInput;
};

export const createStorefrontAlternates = (
  locale: Locale,
  path: string,
): Metadata["alternates"] => ({
  canonical: getLocalizedPath(locale, path),
  languages: Object.fromEntries(
    locales.map((code) => [code, getLocalizedPath(code, path)]),
  ),
});

export const createStorefrontMetadata = async ({
  locale,
  path,
  title,
  description,
  noindex,
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
    robots: noindex ? NOINDEX_ROBOTS : undefined,
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
