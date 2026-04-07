import { POST } from "@/client-api";
import type { Locale } from "@/i18n/config";
import type { StoredCartItem, CartResolveResponse } from "@/types/cart";

export const resolveCartClient = async (
  payload: {
    locale: Locale;
    items: StoredCartItem[];
  },
  options?: Omit<RequestInit, "method" | "body">,
) => POST<CartResolveResponse>("/api/cart/resolve", payload, options);