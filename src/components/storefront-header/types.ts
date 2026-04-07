import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";
import type { CountryCode } from "@/utils";

import type { StorefrontNavigationPaths } from "./navigation";

export type StorefrontHeaderProps = {
  locale: Locale;
  country: CountryCode;
  dictionary: StorefrontDictionary;
  homeHref: string;
  localizedPaths: Record<Locale, string>;
  navigationPaths?: StorefrontNavigationPaths;
};

export type StorefrontNavItem = {
  key: "books" | "shop" | "story" | "faq";
  label: string;
  href: string;
};

export type { StorefrontNavigationPaths } from "./navigation";
