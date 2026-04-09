import type { WishlistItem } from "@/types/wishlist";

import type { FavoritesPageViewProps } from "../types";

export type ResolvedWishlistItem = WishlistItem & {
  product: NonNullable<WishlistItem["product"]>;
};

export type FavoritesWishlistGridProps = {
  locale: FavoritesPageViewProps["locale"];
  authState: boolean;
  authCopy: FavoritesPageViewProps["accountDictionary"];
  guestCopy: FavoritesPageViewProps["storefrontDictionary"]["favoritesPage"];
  accountDictionary: FavoritesPageViewProps["accountDictionary"];
  categoryLabels: FavoritesPageViewProps["categoryLabels"];
  items: ResolvedWishlistItem[];
  onAddToCart: (productId: string) => void;
  onToggleWishlist: (productId: string) => Promise<void>;
};