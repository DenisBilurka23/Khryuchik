import type { WishlistItem } from "@/types/wishlist";
import type { Locale } from "@/i18n/config";

export type ResolvedWishlistItem = WishlistItem & {
  product: NonNullable<WishlistItem["product"]>;
};

export type FavoritesWishlistGridProps = {
  locale: Locale;
  authState: boolean;
  categoryLabels: Record<string, string>;
  items: ResolvedWishlistItem[];
  onAddToCart: (productId: string) => void;
  onToggleWishlist: (productId: string) => Promise<void>;
};