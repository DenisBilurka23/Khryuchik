import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/utils";

import type { StorefrontNavigationPaths } from "./navigation";

export type StorefrontHeaderProps = {
  locale: Locale;
  country: CountryCode;
  homeHref: string;
  localizedPaths: Record<Locale, string>;
  availableLocales: string[];
  navigationPaths?: StorefrontNavigationPaths;
};

export type StorefrontNavItem = {
  key: "shop" | "story" | "faq";
  label: string;
  href: string;
};

export type { StorefrontNavigationPaths } from "./navigation";
