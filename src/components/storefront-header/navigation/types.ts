import type { Locale } from "@/i18n/config";

export type StorefrontNavigationPaths = {
  shop: string;
  story: string;
  faq: string;
  favorites: string;
  cart: string;
};

export type StorefrontHeaderViewModel = {
  localizedPaths: Record<Locale, string>;
  navigationPaths: StorefrontNavigationPaths;
};