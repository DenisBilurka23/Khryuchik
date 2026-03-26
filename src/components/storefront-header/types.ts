import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";
import type { CountryCode } from "@/lib/countries";
import type { SxProps, Theme } from "@mui/material/styles";

export type StorefrontHeaderProps = {
  locale: Locale;
  country: CountryCode;
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

export type CountrySwitcherProps = {
  country: CountryCode;
  locale: Locale;
  label: string;
  sx?: SxProps<Theme>;
};

export type LocaleSwitcherProps = {
  locale: Locale;
  label: string;
  localizedPaths: Record<Locale, string>;
  sx?: SxProps<Theme>;
};

export type HeaderSelectOption = {
  value: string;
  label: string;
};

export type HeaderSelectProps = {
  value: string;
  label: string;
  options: HeaderSelectOption[];
  onChange: (value: string) => void;
  icon: React.ReactNode;
  disabled?: boolean;
  sx?: SxProps<Theme>;
};

export type StorefrontNavItem = {
  key: "books" | "shop" | "story" | "faq";
  label: string;
  href: string;
};

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
