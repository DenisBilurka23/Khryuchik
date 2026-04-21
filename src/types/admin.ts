import type { Locale } from "@/i18n/config";
import type {
  CategoryDocument,
  ProductDetailDocument,
  ProductDocument,
  ProductType,
} from "@/types/catalog";
import type { AuthProvider } from "@/types/users";

export type AdminViewKey =
  | "dashboard"
  | "products"
  | "categories"
  | "orders"
  | "customers"
  | "shipping"
  | "promocodes"
  | "settings";

export type AdminNavItem = {
  key: AdminViewKey;
  label: string;
  href: string;
};

export type AdminCustomerListItem = {
  id: string;
  email: string;
  name: string;
  phone: string;
  isAdmin: boolean;
  authProviders: AuthProvider[];
  createdAt: string;
};

export type AdminProductPayload = {
  product: ProductDocument;
  details: ProductDetailDocument;
};

export type AdminProductListItem = {
  productId: string;
  title: string;
  slug: string;
  type: ProductType;
  category: string;
  sku: string;
  priceLabel: string;
  availability: ProductDocument["inventory"]["availability"];
  isActive: boolean;
  visibleInShop: boolean;
  featured: boolean;
  sortOrder: number;
};

export type AdminCategoryListItem = {
  key: string;
  isActive: boolean;
  visibleInShop: boolean;
  visibleInHomeTabs: boolean;
  sortOrder: number;
  itemsCount: number;
  translations: CategoryDocument["translations"];
};

export type AdminDashboardStats = {
  totalProducts: number;
  activeProducts: number;
  booksCount: number;
  categoriesCount: number;
  featuredCount: number;
  totalUsers: number;
  adminUsers: number;
};

export type AdminProductEditorData = {
  payload: AdminProductPayload;
  categories: CategoryDocument[];
};

export type AdminCategoryUpsertInput = {
  key: string;
  isActive: boolean;
  visibleInShop: boolean;
  visibleInHomeTabs: boolean;
  sortOrder: number;
  translations: Partial<
    Record<Locale, { label: string; description?: string }>
  >;
};