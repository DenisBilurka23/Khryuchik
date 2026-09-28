import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/constants/contact";
import type { Locale } from "@/i18n/config";
import { getLocalizedPath, type RegionCode } from "@/utils";

const internalPathsByKey: Record<string, string> = {
  books: "/shop?category=books",
  shop: "/shop",
  story: "/story",
  shipping: "/delivery",
  returns: "/delivery#returns",
  contacts: "/contacts",
  terms: "/terms",
  privacy: "/privacy",
};

export const getFooterItemHref = (
  key: string,
  locale: Locale,
  region: RegionCode,
): string => {
  if (key === "instagram") {
    return SOCIAL_LINKS.instagramByRegion[region];
  }

  if (key === "facebook") {
    return SOCIAL_LINKS.facebook;
  }

  if (key === "email") {
    return `mailto:${CONTACT_EMAIL}`;
  }

  const path = internalPathsByKey[key];

  return path ? getLocalizedPath(locale, path) : "#";
};
