import type { LocalizedProductSummary } from "@/types/catalog";

export const GUEST_WISHLIST_STORAGE_KEY = "khryuchik_guest_wishlist";
export const GUEST_WISHLIST_CHANGE_EVENT = "khryuchik-guest-wishlist-change";

export type GuestWishlistItem = {
  productId: string;
  addedAt: string;
};

export type WishlistItem = GuestWishlistItem & {
  product?: LocalizedProductSummary;
};

export type WishlistListResponse = {
  items: WishlistItem[];
  ids: string[];
};

export type WishlistMutationResponse = {
  ok: boolean;
  ids: string[];
};

export type UseWishlistResult = {
  items: WishlistItem[];
  ids: string[];
  isLoading: boolean;
  isAuthenticated: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
};