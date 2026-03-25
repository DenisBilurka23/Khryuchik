import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";

export type StorefrontHeaderProps = {
  locale: Locale;
  dictionary: StorefrontDictionary;
  homeHref: string;
  localizedPaths: Record<Locale, string>;
  navigationPaths?: {
    books: string;
    shop: string;
    story: string;
    faq: string;
    cart: string;
  };
};

export type CartButtonProps = {
  href: string;
  label: string;
  className?: string;
};
