import "server-only";

import type { Locale } from "@/i18n/config";
import type {
  AdminCategoryUpsertInput,
  AdminProductPayload,
} from "@/types/admin";
import type { ProductAvailability, ProductType } from "@/types/catalog";
import type {
  ProductFileAsset,
  ProductImage,
  ProductOption,
  ProductReview,
} from "@/types/product-details";
import type { CurrencyCode } from "@/utils";

const parseString = (formData: FormData, key: string) => {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
};

const parseOptionalString = (formData: FormData, key: string) => {
  const value = parseString(formData, key).trim();

  return value || undefined;
};

const parseNumber = (formData: FormData, key: string, fallback = 0) => {
  const value = Number(parseString(formData, key));

  return Number.isFinite(value) ? value : fallback;
};

const parseOptionalNumber = (formData: FormData, key: string) => {
  const rawValue = parseString(formData, key).trim();

  if (!rawValue) {
    return undefined;
  }

  const value = Number(rawValue);

  return Number.isFinite(value) ? value : undefined;
};

const parseBoolean = (formData: FormData, key: string) =>
  formData.get(key) === "on";

const parseCsvList = (formData: FormData, key: string) =>
  parseString(formData, key)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

const parseMultilineList = (formData: FormData, key: string) =>
  parseString(formData, key)
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean);

const parseJsonField = <T>(formData: FormData, key: string, fallback: T): T => {
  const rawValue = parseString(formData, key).trim();

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    throw new Error(`Invalid JSON in field: ${key}`);
  }
};

const parseLocaleTranslation = (formData: FormData, locale: Locale) => ({
  title: parseString(formData, `${locale}.title`).trim(),
  shortTitle: parseOptionalString(formData, `${locale}.shortTitle`),
  shortDescription: parseString(formData, `${locale}.shortDescription`).trim(),
  price: parseNumber(formData, locale === "ru" ? "pricing.BY.price" : "pricing.US.price"),
  currency: parseString(formData, locale === "ru" ? "pricing.BY.currency" : "pricing.US.currency") as CurrencyCode,
  emoji: parseString(formData, `${locale}.emoji`).trim(),
  thumbnailBackgroundColor: parseOptionalString(
    formData,
    `${locale}.thumbnailBackgroundColor`,
  ),
  lang: parseOptionalString(formData, `${locale}.lang`) ?? locale.toUpperCase(),
});

const parseDetailLocaleTranslation = (formData: FormData, locale: Locale) => ({
  subtitle: parseString(formData, `${locale}.subtitle`).trim(),
  oldPrice: parseOptionalNumber(formData, `${locale}.detailOldPrice`),
  badge: parseOptionalString(formData, `${locale}.badge`),
  storyLabel: parseOptionalString(formData, `${locale}.storyLabel`),
  description: parseString(formData, `${locale}.description`).trim(),
  images: parseJsonField<ProductImage[]>(formData, `${locale}.imagesJson`, []),
  languages: parseJsonField<ProductOption[]>(formData, `${locale}.languagesJson`, []),
  formats: parseJsonField<ProductOption[]>(formData, `${locale}.formatsJson`, []),
  sizes: parseJsonField<ProductOption[]>(formData, `${locale}.sizesJson`, []),
  colors: parseJsonField<ProductOption[]>(formData, `${locale}.colorsJson`, []),
  specs: parseJsonField<Array<{ label: string; value: string }>>(formData, `${locale}.specsJson`, []),
  delivery: parseMultilineList(formData, `${locale}.deliveryLines`),
  reviews: parseJsonField<ProductReview[]>(formData, `reviewsJson`, []),
  digitalAssets: parseJsonField<ProductFileAsset[]>(
    formData,
    `${locale}.digitalAssetsJson`,
    [],
  ),
});

export const parseAdminCategoryFormData = (
  formData: FormData,
): AdminCategoryUpsertInput => ({
  key: parseString(formData, "key").trim(),
  isActive: parseBoolean(formData, "isActive"),
  visibleInShop: parseBoolean(formData, "visibleInShop"),
  visibleInHomeTabs: parseBoolean(formData, "visibleInHomeTabs"),
  sortOrder: parseNumber(formData, "sortOrder", 100),
  translations: {
    ru: {
      label: parseString(formData, "ru.label").trim(),
    },
    en: {
      label: parseString(formData, "en.label").trim(),
    },
  },
});

export const parseAdminProductFormData = (
  formData: FormData,
): AdminProductPayload => ({
  product: {
    productId: parseString(formData, "productId").trim(),
    slug: parseString(formData, "slug").trim(),
    classification: {
      type: parseString(formData, "type") as ProductType,
      category: parseString(formData, "category").trim(),
    },
    status: {
      isActive: parseBoolean(formData, "isActive"),
      visibleInShop: parseBoolean(formData, "visibleInShop"),
      visibleOnHome: parseBoolean(formData, "visibleOnHome"),
    },
    merchandising: {
      sortOrder: parseNumber(formData, "sortOrder", 100),
    },
    inventory: {
      quantity: parseOptionalNumber(formData, "quantity") ?? null,
      availability: parseString(formData, "availability") as ProductAvailability,
    },
    pricing: {
      BY: {
        price: parseNumber(formData, "pricing.BY.price"),
        currency: parseString(formData, "pricing.BY.currency") as CurrencyCode,
        oldPrice: parseOptionalNumber(formData, "pricing.BY.oldPrice"),
      },
      US: {
        price: parseNumber(formData, "pricing.US.price"),
        currency: parseString(formData, "pricing.US.currency") as CurrencyCode,
        oldPrice: parseOptionalNumber(formData, "pricing.US.oldPrice"),
      },
    },
    translations: {
      ru: parseLocaleTranslation(formData, "ru"),
      en: parseLocaleTranslation(formData, "en"),
    },
  },
  details: {
    productId: parseString(formData, "productId").trim(),
    sku: parseString(formData, "sku").trim(),
    storyProductId: parseOptionalString(formData, "storyProductId"),
    relatedProductIds: parseCsvList(formData, "relatedProductIds"),
    translations: {
      ru: parseDetailLocaleTranslation(formData, "ru"),
      en: parseDetailLocaleTranslation(formData, "en"),
    },
  },
});