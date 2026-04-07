import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";
import type { CountryCode } from "@/utils";

import type { StorefrontNavItem } from "../types";

export type MobileMenuProps = {
  brand: StorefrontDictionary["brand"];
  locale: Locale;
  country: CountryCode;
  localizedPaths: Record<Locale, string>;
  navItems: StorefrontNavItem[];
  cartHref: string;
  cartLabel: string;
  localeSwitcherLabel: string;
  countrySwitcherLabel: string;
  homeHref: string;
};