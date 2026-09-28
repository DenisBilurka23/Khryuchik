import type { Locale } from "@/i18n/config";
import type { RegionCode } from "@/utils";

import type { StorefrontNavItem } from "../types";

export type MobileMenuProps = {
  locale: Locale;
  region: RegionCode;
  localizedPaths: Record<Locale, string>;
  availableLocales: string[];
  availableRegions: RegionCode[];
  navItems: StorefrontNavItem[];
  cartHref: string;
  homeHref: string;
  favoritesHref: string;
};

export type MobileMenuItem =
  | MobileMenuProps["navItems"][number]
  | {
      key: "account" | "favorites";
      label: string;
      href: string;
    };
