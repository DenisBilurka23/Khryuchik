import type { Locale } from "@/i18n/config";
import type { AccountOrder } from "@/types/order";
import type { ProductPreview } from "@/types/catalog";
import type { AccountDownload } from "@/types/download";
import type { UserReviewSummary } from "@/types/reviews";
import type { AuthProvider, UserShippingAddress } from "@/types/users";
import type { CountryCode } from "@/utils";

export type AccountPageUser = {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  image?: string | null;
  authProviders?: AuthProvider[];
  shippingAddresses?: UserShippingAddress[];
  selectedShippingAddressId?: string | null;
};

export type AccountPageViewProps = {
  locale: Locale;
  country: CountryCode;
  availableLocales: string[];
  availableCountries: CountryCode[];
  homeHref: string;
  favoriteCategoryLabels: Record<string, string>;
  user: AccountPageUser;
  orders: AccountOrder[];
  orderProducts: Record<string, ProductPreview>;
  productReviews: Record<string, UserReviewSummary>;
  downloads: AccountDownload[];
};

export type SectionKey =
  | "overview"
  | "orders"
  | "books"
  | "addresses"
  | "favorites"
  | "settings"
  | "logout";
