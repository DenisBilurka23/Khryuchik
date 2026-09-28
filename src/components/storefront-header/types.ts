import type { Locale } from "@/i18n/config";
import type { RegionCode } from "@/utils";

import type { StorefrontNavigationPaths } from "./navigation";

export type StorefrontHeaderProps = {
  locale: Locale;
  region: RegionCode;
  homeHref: string;
  localizedPaths: Record<Locale, string>;
  availableLocales: string[];
  availableRegions: RegionCode[];
  navigationPaths?: StorefrontNavigationPaths;
};

export type StorefrontNavItem = {
  key: "home" | "shop" | "story" | "entertainment" | "faq" | "contacts";
  label: string;
  href: string;
};

export type { StorefrontNavigationPaths } from "./navigation";
