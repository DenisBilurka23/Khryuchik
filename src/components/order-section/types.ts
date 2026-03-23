import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";
import type { CartItem } from "@/types/cart";

export type OrderSectionProps = {
  locale: Locale;
  total: number;
  name: string;
  contact: string;
  note: string;
  status: string;
  mailtoHref: string;
  cartItems: CartItem[];
  dictionary: StorefrontDictionary;
  setName: (value: string) => void;
  setContact: (value: string) => void;
  setNote: (value: string) => void;
  copyOrder: () => Promise<void>;
  clearCart: () => void;
};
