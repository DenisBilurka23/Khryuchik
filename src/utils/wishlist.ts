import {
  GUEST_WISHLIST_CHANGE_EVENT,
  GUEST_WISHLIST_STORAGE_KEY,
  type GuestWishlistItem,
} from "@/types/wishlist";

export { GUEST_WISHLIST_CHANGE_EVENT } from "@/types/wishlist";

const isGuestWishlistItem = (value: unknown): value is GuestWishlistItem => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.productId === "string" &&
    candidate.productId.trim().length > 0 &&
    typeof candidate.addedAt === "string"
  );
};

const sortWishlistItems = (items: GuestWishlistItem[]) =>
  [...items].sort(
    (left, right) => new Date(right.addedAt).getTime() - new Date(left.addedAt).getTime(),
  );

const emitGuestWishlistChange = (items: GuestWishlistItem[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(GUEST_WISHLIST_CHANGE_EVENT, {
      detail: { items },
    }),
  );
};

const writeGuestWishlist = (items: GuestWishlistItem[]) => {
  if (typeof window === "undefined") {
    return items;
  }

  const nextItems = sortWishlistItems(items);

  window.localStorage.setItem(
    GUEST_WISHLIST_STORAGE_KEY,
    JSON.stringify(nextItems),
  );
  emitGuestWishlistChange(nextItems);

  return nextItems;
};

export const getGuestWishlist = () => {
  if (typeof window === "undefined") {
    return [] as GuestWishlistItem[];
  }

  const rawValue = window.localStorage.getItem(GUEST_WISHLIST_STORAGE_KEY);

  if (!rawValue) {
    return [] as GuestWishlistItem[];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown;

    if (!Array.isArray(parsedValue)) {
      return [] as GuestWishlistItem[];
    }

    return sortWishlistItems(parsedValue.filter(isGuestWishlistItem));
  } catch {
    return [] as GuestWishlistItem[];
  }
};

export const addToGuestWishlist = (productId: string) => {
  const normalizedProductId = productId.trim();

  if (!normalizedProductId) {
    return getGuestWishlist();
  }

  const wishlist = getGuestWishlist();

  if (wishlist.some((item) => item.productId === normalizedProductId)) {
    return wishlist;
  }

  return writeGuestWishlist([
    { productId: normalizedProductId, addedAt: new Date().toISOString() },
    ...wishlist,
  ]);
};

export const removeFromGuestWishlist = (productId: string) =>
  writeGuestWishlist(
    getGuestWishlist().filter((item) => item.productId !== productId.trim()),
  );

export const toggleGuestWishlist = (productId: string) => {
  const normalizedProductId = productId.trim();

  if (!normalizedProductId) {
    return getGuestWishlist();
  }

  return isInGuestWishlist(normalizedProductId)
    ? removeFromGuestWishlist(normalizedProductId)
    : addToGuestWishlist(normalizedProductId);
};

export const clearGuestWishlist = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(GUEST_WISHLIST_STORAGE_KEY);
  emitGuestWishlistChange([]);
};

export const isInGuestWishlist = (productId: string) =>
  getGuestWishlist().some((item) => item.productId === productId.trim());