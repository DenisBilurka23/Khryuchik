import type { Locale } from "@/i18n/config";
import type { AdminPageDictionary } from "@/i18n/types";
import type { AdminNavItem, AdminProductPayload } from "@/types/admin";
import type { ProductDetailTranslation, ProductTranslation } from "@/types/catalog";

export const createAdminNavItems = (
  labels: AdminPageDictionary["nav"],
): AdminNavItem[] => [
  { key: "dashboard", label: labels.dashboard, href: "/admin" },
  { key: "products", label: labels.products, href: "/admin/products" },
  { key: "categories", label: labels.categories, href: "/admin/categories" },
  { key: "customers", label: labels.customers, href: "/admin/customers" },
  { key: "orders", label: labels.orders, href: "/admin/orders" },
];

export const formatAdminDate = (value: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export const getAdminAvailabilityLabel = (
  availability: keyof AdminPageDictionary["shared"]["status"]["availability"],
  labels: AdminPageDictionary["shared"]["status"]["availability"],
) => labels[availability];

export const getAdminProductTypeLabel = (
  type: keyof AdminPageDictionary["shared"]["status"]["productTypes"],
  labels: AdminPageDictionary["shared"]["status"]["productTypes"],
) => labels[type];

export const getAdminAuthProviderLabel = (
  provider: keyof AdminPageDictionary["shared"]["status"]["authProviders"] | string,
  labels: AdminPageDictionary["shared"]["status"]["authProviders"],
) => {
  if (provider === "google" || provider === "credentials") {
    return labels[provider];
  }

  return provider;
};

export const getAdminCategoryLabel = (
  translations: Partial<Record<Locale, { label: string; description?: string }>>,
  locale: Locale,
) => translations[locale]?.label ?? translations.en?.label ?? translations.ru?.label ?? "";

export const normalizeSlugPart = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

export const normalizeSkuPart = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

export const normalizeAdminDate = (value: string) => {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  return value.slice(0, 10);
};

export const buildUniqueValue = (
  baseValue: string,
  isTaken: (candidate: string) => boolean,
) => {
  const normalizedBaseValue = baseValue || "product";

  if (!isTaken(normalizedBaseValue)) {
    return normalizedBaseValue;
  }

  let suffix = 2;

  while (isTaken(`${normalizedBaseValue}-${suffix}`)) {
    suffix += 1;
  }

  return `${normalizedBaseValue}-${suffix}`;
};

const createEmptyTranslation = (locale: Locale): ProductTranslation => ({
  title: "",
  shortTitle: "",
  shortDescription: "",
  price: 0,
  currency: locale === "ru" ? "BYN" : "USD",
  emoji: locale === "ru" ? "📘" : "📘",
  thumbnailBackgroundColor: "#FFF8F0",
  lang: locale === "ru" ? "RU" : "EN",
});

const createEmptyDetailTranslation = (): ProductDetailTranslation => ({
  subtitle: "",
  badge: "",
  storyLabel: "",
  storyTitle: "",
  description: "",
  images: [],
  languages: [],
  formats: [],
  sizes: [],
  colors: [],
  specs: [],
  delivery: [],
  reviews: [],
  digitalAssets: [],
});

export const createEmptyAdminProductPayload = (): AdminProductPayload => ({
  product: {
    productId: "",
    slug: "",
    classification: {
      type: "book",
      category: "books",
    },
    status: {
      isActive: true,
      visibleInShop: true,
      visibleOnHome: false,
    },
    merchandising: {
      sortOrder: 100,
    },
    inventory: {
      quantity: null,
      availability: "in_stock",
    },
    pricing: {},
    translations: {
      ru: createEmptyTranslation("ru"),
      en: createEmptyTranslation("en"),
    },
  },
  details: {
    productId: "",
    sku: "",
    relatedProductIds: [],
    translations: {
      ru: createEmptyDetailTranslation(),
      en: createEmptyDetailTranslation(),
    },
  },
});