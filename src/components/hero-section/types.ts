import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/utils";

export type HeroSectionProps = {
  locale: Locale;
  country: CountryCode;
};

export type HeroCards = {
  featured: {
    label: string;
    title: string;
    price: string;
    href?: string;
  };
  newBook: {
    label: string;
    caption: string;
    emoji: string;
    imageSrc?: string;
    imageAlt?: string;
    href?: string;
  };
};
