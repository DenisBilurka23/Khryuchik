import "server-only";

import type { Metadata } from "next";

const ADMIN_BRAND = "Khryuchik";

export const createAdminMetadata = async (
  title: string,
  description: string,
  locale: string,
): Promise<Metadata> => {
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