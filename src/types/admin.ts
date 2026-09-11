import type { Locale } from "@/i18n/config";
import type {
  CategoryDocument,
  ProductDetailDocument,
  ProductDocument,
  ProductType,
} from "@/types/catalog";
import type {
  EntertainmentCategoryKey,
  EntertainmentItemDocument,
  EntertainmentMedia,
  EntertainmentStatus,
  EntertainmentTranslation,
  EntertainmentVideoStatus,
} from "@/types/entertainment";
import type { LocaleDocument, RegionDocument } from "@/types/localization";
import type { AuthProvider } from "@/types/users";

export type AdminViewKey =
  | "dashboard"
  | "products"
  | "categories"
  | "entertainment"
  | "localization"
  | "orders"
  | "reviews"
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
  firstName: string;
  lastName: string;
  phone: string;
  isAdmin: boolean;
  authProviders: AuthProvider[];
  createdAt: string;
};

export type AdminCustomerEditorData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isAdmin: boolean;
  image?: string | null;
  authProviders: AuthProvider[];
  createdAt: string;
  updatedAt: string;
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
  categoryLabel: string;
  sku: string;
  priceLabel: string;
  availability: ProductDocument["inventory"]["availability"];
  isActive: boolean;
  visibleInShop: boolean;
  sortOrder: number;
};

export type AdminProductOption = {
  id: string;
  title: string;
  slug: string;
};

export type AdminPrintifyImportItem = {
  printifyProductId: string;
  title: string;
  enabledVariantsCount: number;
  previewImageSrc?: string;
  importedProductId?: string;
  importedSlug?: string;
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
  totalUsers: number;
  adminUsers: number;
};

export type AdminProductEditorData = {
  payload: AdminProductPayload;
  categories: CategoryDocument[];
  activeLocales: LocaleDocument[];
  activeRegions: RegionDocument[];
  initialRelatedProductOptions: AdminProductOption[];
  selectedRelatedProductOptions: AdminProductOption[];
  selectedStoryProductOption?: AdminProductOption;
};

export type AdminCategoryUpsertInput = {
  key?: string;
  isActive: boolean;
  visibleInShop: boolean;
  visibleInHomeTabs: boolean;
  sortOrder: number;
  translations: Partial<Record<Locale, { label: string }>>;
};

export type AdminLocaleListItem = {
  code: string;
  label: string;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
};

export type AdminRegionListItem = {
  code: string;
  label: string;
  currency: string;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
};

export type AdminLocaleUpsertInput = {
  code: string;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
};

export type AdminRegionUpsertInput = {
  code: string;
  currency: string;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
};

export type AdminLocalizationData = {
  locales: AdminLocaleListItem[];
  regions: AdminRegionListItem[];
};

export type AdminEntertainmentListItem = {
  slug: string;
  title: string;
  category: EntertainmentCategoryKey;
  mediaType: EntertainmentMedia["type"];
  mediaStatus?: EntertainmentVideoStatus;
  isActive: boolean;
  visibleOnHome: boolean;
  sortOrder: number;
  updatedAt: string;
};

export type AdminEntertainmentEditorData = {
  item: EntertainmentItemDocument;
  activeLocales: LocaleDocument[];
};

export type AdminEntertainmentUploadedFile = {
  objectKey: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  url?: string;
};

export type AdminEntertainmentMediaInput = {
  type: EntertainmentMedia["type"];
  uploadedFile?: AdminEntertainmentUploadedFile;
  durationSeconds?: number;
};

export type AdminEntertainmentUpsertInput = {
  currentSlug?: string;
  slug: string;
  category: EntertainmentCategoryKey;
  sortOrder: number;
  status: EntertainmentStatus;
  media: AdminEntertainmentMediaInput;
  translations: Partial<Record<Locale, EntertainmentTranslation>>;
};
