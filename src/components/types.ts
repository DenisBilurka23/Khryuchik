import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";

export type CartItem = StorefrontDictionary["shopSection"]["items"][number] & {
  quantity: number;
  subtotal: number;
};

export type StorefrontProps = {
  locale: Locale;
  dictionary: StorefrontDictionary;
};
