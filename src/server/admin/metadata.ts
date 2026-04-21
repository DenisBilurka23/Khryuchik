import "server-only";

import type { Metadata } from "next";

import { getAdminPageContext } from "@/server/admin/page-context";

const ADMIN_BRAND = "Khryuchik";

export const createAdminMetadata = async (
  title: string,
  description: string,
): Promise<Metadata> => {
  const { locale } = await getAdminPageContext();
  const fullTitle = `${title} | ${ADMIN_BRAND}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      type: "website",
      locale,
      title: fullTitle,
      description,
      siteName: ADMIN_BRAND,
    },
  };
};

export const createAdminRootMetadata = async (): Promise<Metadata> => {
  const { dictionary, locale } = await getAdminPageContext();
  const title = `${dictionary.layout.brandSubtitle} | ${ADMIN_BRAND}`;
  const description = dictionary.layout.secureAccessText;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale,
      title,
      description,
      siteName: ADMIN_BRAND,
    },
  };
};