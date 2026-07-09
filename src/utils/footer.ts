import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/constants/contact";
import type { Locale } from "@/i18n/config";
import { getLocalizedPath, type CountryCode } from "@/utils";

const internalPathsByKey: Record<string, string> = {
  books: "/shop?category=books",
  shop: "/shop",
  story: "/story",
  shipping: "/delivery",
  returns: "/delivery#returns",
  contacts: "/story#author",
  terms: "/terms",
  privacy: "/privacy",
};

export const getFooterItemHref = (
  key: string,
  locale: Locale,
  country: CountryCode,
): string => {
  if (key === "instagram") {
    const instagramLinks: Record<string, string> =
      SOCIAL_LINKS.instagramByCountry;

    return instagramLinks[country] ?? SOCIAL_LINKS.instagramByCountry.US;
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
