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

const createEmptyTranslation = (locale: Locale): ProductTranslation => ({
  slug: "",
  title: "",
  shortTitle: "",
  shortDescription: "",
  price: 0,
  currency: locale === "ru" ? "BYN" : "USD",
  emoji: locale === "ru" ? "📘" : "📘",
  bgColor: "#FFF8F0",
  lang: locale === "ru" ? "RU" : "EN",
});

const createEmptyDetailTranslation = (): ProductDetailTranslation => ({
  subtitle: "",
  badge: "",
  storyLabel: "",
  storyTitle: "",
  sku: "",
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
    classification: {
      type: "book",
      category: "books",
    },
    status: {
      isActive: true,
      visibleInShop: true,
      visibleOnHome: false,
      visibleInSearch: true,
    },
    merchandising: {
      featured: false,
      sortOrder: 100,
      placements: ["shop"],
      flags: [],
    },
    inventory: {
      trackQuantity: false,
      quantity: null,
      allowBackorder: true,
      availability: "in_stock",
    },
    pricing: {
      BY: { price: 0, currency: "BYN" },
      US: { price: 0, currency: "USD" },
    },
    translations: {
      ru: createEmptyTranslation("ru"),
      en: createEmptyTranslation("en"),
    },
  },
  details: {
    productId: "",
    relatedProductIds: [],
    translations: {
      ru: createEmptyDetailTranslation(),
      en: createEmptyDetailTranslation(),
    },
  },
});