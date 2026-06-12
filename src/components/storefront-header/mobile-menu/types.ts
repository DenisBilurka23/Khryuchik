import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/utils";

import type { StorefrontNavItem } from "../types";

export type MobileMenuProps = {
  locale: Locale;
  country: CountryCode;
  localizedPaths: Record<Locale, string>;
  availableLocales: string[];
  navItems: StorefrontNavItem[];
  cartHref: string;
  homeHref: string;
  favoritesHref: string;
};