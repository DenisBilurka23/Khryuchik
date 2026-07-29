import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/utils";

import type { StorefrontNavItem } from "../types";

export type MobileMenuProps = {
  locale: Locale;
  country: CountryCode;
  localizedPaths: Record<Locale, string>;
  availableLocales: string[];
  availableCountries: CountryCode[];
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
