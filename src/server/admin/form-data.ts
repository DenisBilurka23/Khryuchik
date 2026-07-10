import "server-only";

import { defaultLocale, type Locale } from "@/i18n/config";
import type {
  AdminCategoryUpsertInput,
  AdminLocaleUpsertInput,
  AdminProductPayload,
  AdminRegionUpsertInput,
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
  // Display price/currency come from per-region pricing; these are placeholders
  // normalized in `sanitizeProductPayload`.
  price: 0,
  currency: "" as CurrencyCode,
  emoji: parseString(formData, `${locale}.emoji`).trim(),
  thumbnailBackgroundColor: parseOptionalString(
    formData,
    `${locale}.thumbnailBackgroundColor`,
  ),
  lang: parseOptionalString(formData, `${locale}.lang`),
});

const parseDetailLocaleTranslation = (formData: FormData, locale: Locale) => ({
  subtitle: parseString(formData, `${locale}.subtitle`).trim(),
  oldPrice: parseOptionalNumber(formData, `${locale}.detailOldPrice`),
  badge: parseOptionalString(formData, `${locale}.badge`),
  storyLabel: parseOptionalString(formData, `${locale}.storyLabel`),
  description: parseString(formData, `${locale}.description`).trim(),
  images: parseJsonField<ProductImage[]>(formData, `${locale}.imagesJson`, []),
  languages: parseJsonField<ProductOption[]>(formData, "languagesJson", []),
  formats: parseJsonField<ProductOption[]>(formData, "formatsJson", []),
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
  key: parseOptionalString(formData, "key"),
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

export const parseAdminLocaleFormData = (
  formData: FormData,
): AdminLocaleUpsertInput => ({
  code: parseString(formData, "code").trim(),
  isActive: parseBoolean(formData, "isActive"),
  isDefault: parseBoolean(formData, "isDefault"),
  sortOrder: parseNumber(formData, "sortOrder", 100),
});

export const parseAdminRegionFormData = (
  formData: FormData,
): AdminRegionUpsertInput => ({
  code: parseString(formData, "code").trim(),
  currency: parseString(formData, "currency").trim(),
  isActive: parseBoolean(formData, "isActive"),
  isDefault: parseBoolean(formData, "isDefault"),
  sortOrder: parseNumber(formData, "sortOrder", 100),
});

const parseRegionPricing = (formData: FormData, region: string) => ({
  price: parseNumber(formData, `pricing.${region}.price`),
  currency: parseString(formData, `pricing.${region}.currency`) as CurrencyCode,
  oldPrice: parseOptionalNumber(formData, `pricing.${region}.oldPrice`),
});

export const parseAdminProductFormData = (
  formData: FormData,
): AdminProductPayload => {
  const localeCodes = parseCsvList(formData, "localeCodes");
  const regionCodes = parseCsvList(formData, "regionCodes");
  const productId = parseString(formData, "productId").trim();

  // A language is published only when "Add for this language" is on. The
  // default locale is always published (it is the storefront fallback source).
  const activeLocaleCodes = localeCodes.filter(
    (locale) =>
      locale === defaultLocale || parseBoolean(formData, `${locale}.active`),
  );

  // Regions are activated per product; an unchecked region is excluded from
  // `availableRegions`, hiding the product there on the storefront.
  const availableRegions = regionCodes.filter((region) =>
    parseBoolean(formData, `region.${region}.active`),
  );

  const languages = parseJsonField<ProductOption[]>(formData, "languagesJson", []);
  const langLabel = languages.length > 0
    ? languages.map((l) => l.value.toUpperCase()).join(" / ")
    : undefined;

  return {
    product: {
      productId,
      slug: parseString(formData, "slug").trim(),
      classification: {
        type: parseString(formData, "type") as ProductType,
        category: parseString(formData, "category").trim(),
      },
      status: {
        isActive: parseBoolean(formData, "isActive"),
        visibleInShop: parseBoolean(formData, "visibleInShop"),
        visibleOnHome: parseBoolean(formData, "visibleOnHome"),
        notifySubscribers: parseBoolean(formData, "notifySubscribers"),
      },
      merchandising: {
        sortOrder: parseNumber(formData, "sortOrder", 100),
      },
      inventory: {
        quantity: parseOptionalNumber(formData, "quantity") ?? null,
        availability: parseString(
          formData,
          "availability",
        ) as ProductAvailability,
      },
      pricing: Object.fromEntries(
        regionCodes.map((region) => [region, parseRegionPricing(formData, region)]),
      ) as AdminProductPayload["product"]["pricing"],
      availableRegions,
      translations: Object.fromEntries(
        activeLocaleCodes.map((locale) => {
          const t = parseLocaleTranslation(formData, locale);
          return [locale, { ...t, lang: langLabel }];
        }),
      ) as AdminProductPayload["product"]["translations"],
    },
    details: {
      productId,
      sku: parseString(formData, "sku").trim(),
      storyProductId: parseOptionalString(formData, "storyProductId"),
      relatedProductIds: parseCsvList(formData, "relatedProductIds"),
      translations: Object.fromEntries(
        activeLocaleCodes.map((locale) => [
          locale,
          parseDetailLocaleTranslation(formData, locale),
        ]),
      ) as AdminProductPayload["details"]["translations"],
    },
  };
};