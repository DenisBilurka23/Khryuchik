import { DELETE, GET, POST } from "@/client-api";
import type { Locale } from "@/i18n/config";
import type {
  GuestWishlistItem,
  WishlistListResponse,
  WishlistMutationResponse,
} from "@/types/wishlist";
import { clearGuestWishlist, getGuestWishlist } from "@/utils/wishlist";

export const getWishlist = async (locale: Locale) =>
  GET<WishlistListResponse>(`/api/wishlist?locale=${encodeURIComponent(locale)}`);

export const addToWishlist = async (productId: string) =>
  POST<WishlistMutationResponse>("/api/wishlist", { productId });

export const removeFromWishlist = async (productId: string) =>
  DELETE<WishlistMutationResponse>(`/api/wishlist/${encodeURIComponent(productId)}`);

export const mergeWishlist = async (productIds: string[]) =>
  POST<WishlistMutationResponse>("/api/wishlist/merge", { productIds });

export const resolveGuestWishlist = async (
  locale: Locale,
  items: GuestWishlistItem[],
) => POST<WishlistListResponse>("/api/wishlist/guest", { locale, items });

export const mergeGuestWishlistAfterLogin = async (options?: {
  refreshWishlist?: () => Promise<void> | void;
}) => {
  const guestWishlist = getGuestWishlist();
  const productIds = guestWishlist.map((item) => item.productId);

  if (productIds.length === 0) {
    return false;
  }

  try {
    const response = await mergeWishlist(productIds);

    if (!response.ok) {
      return false;
    }

    clearGuestWishlist();
    await options?.refreshWishlist?.();

    return true;
  } catch {
    return false;
  }
};