import "server-only";

import { defaultLocale, type Locale } from "@/i18n/config";
import type {
  AdminCategoryUpsertInput,
  AdminLocaleUpsertInput,
  AdminProductPayload,
  AdminRegionUpsertInput,
} from "@/types/admin";
import type {
  BookSeries,
  ProductAvailability,
  ProductPrintedStock,
  ProductShipping,
  ProductType,
} from "@/types/catalog";
import type {
  ProductFileAsset,
  ProductImage,
  ProductOption,
  ProductReview,
} from "@/types/product-details";
import { SHIPPING_HUB_CODES } from "@/constants/shipping";
import type { ShippingManufacturer } from "@/types/shipping";
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
  subtitle: parseString(formData, `${locale}.subtitle`).trim(),
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
  oldPrice: parseOptionalNumber(formData, `${locale}.detailOldPrice`),
  storyLabel: parseOptionalString(formData, `${locale}.storyLabel`),
  description: parseString(formData, `${locale}.description`).trim(),
  images: parseJsonField<ProductImage[]>(formData, `${locale}.imagesJson`, []),
  languages: parseJsonField<ProductOption[]>(formData, "languagesJson", []),
  formats: parseJsonField<ProductOption[]>(formData, "formatsJson", []),
  sizes: parseJsonField<ProductOption[]>(formData, `${locale}.sizesJson`, []),
  colors: parseJsonField<ProductOption[]>(formData, `${locale}.colorsJson`, []),
  specs: parseJsonField<Array<{ label: string; value: string }>>(
    formData,
    `${locale}.specsJson`,
    [],
  ),
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

const parseCurrencyPricing = (formData: FormData, currency: CurrencyCode) => ({
  price: parseNumber(formData, `pricing.${currency}.price`),
  oldPrice: parseOptionalNumber(formData, `pricing.${currency}.oldPrice`),
});

const parseProductPrintedStock = (
  formData: FormData,
  localeCodes: string[],
): ProductPrintedStock => {
  const posted = parseJsonField<Record<string, Record<string, unknown>>>(
    formData,
    "shipping.stockByLanguage",
    {},
  );

  return Object.fromEntries(
    Object.entries(posted)
      .filter(([language]) => localeCodes.includes(language))
      .map(([language, hubs]) => [
        language,
        Object.fromEntries(
          SHIPPING_HUB_CODES.flatMap((hub) => {
            const quantity = Math.trunc(Number(hubs?.[hub]));

            return Number.isFinite(quantity) && quantity > 0
              ? [[hub, quantity] as const]
              : [];
          }),
        ),
      ]),
  );
};

const MANUFACTURER_FIELDS = [
  "name",
  "street",
  "city",
  "regionCode",
  "postalCode",
  "country",
] as const;

export const parseAdminShippingSettingsFormData = (
  formData: FormData,
): ShippingManufacturer | undefined => {
  const entries = MANUFACTURER_FIELDS.map(
    (field) =>
      [
        field,
        (
          parseOptionalString(formData, `shipping.manufacturer.${field}`) ?? ""
        ).trim(),
      ] as const,
  );

  return entries.every(([, value]) => value.length > 0)
    ? (Object.fromEntries(entries) as ShippingManufacturer)
    : undefined;
};

const parseProductShipping = (
  formData: FormData,
  localeCodes: string[],
): ProductShipping | undefined => {
  const weightGrams = parseOptionalNumber(formData, "shipping.weightGrams");

  if (weightGrams === undefined) {
    return undefined;
  }

  const stockByLanguage = parseProductPrintedStock(formData, localeCodes);

  return {
    stockByLanguage,
    weightGrams,
    lengthMm: parseNumber(formData, "shipping.lengthMm"),
    widthMm: parseNumber(formData, "shipping.widthMm"),
    heightMm: parseNumber(formData, "shipping.heightMm"),
    hubs: SHIPPING_HUB_CODES.filter((hub) =>
      Object.values(stockByLanguage).some(
        (hubStock) => (hubStock?.[hub] ?? 0) > 0,
      ),
    ),
    hsCode: parseOptionalString(formData, "shipping.hsCode"),
  };
};

export const parseAdminProductFormData = (
  formData: FormData,
): AdminProductPayload => {
  const localeCodes = parseCsvList(formData, "localeCodes");
  const regionCodes = parseCsvList(formData, "regionCodes");
  const currencyCodes = parseCsvList(formData, "currencyCodes");
  const productId = parseString(formData, "productId").trim();

  const activeLocaleCodes = localeCodes.filter(
    (locale) =>
      locale === defaultLocale || parseBoolean(formData, `${locale}.active`),
  );

  const availableRegions = regionCodes.filter((region) =>
    parseBoolean(formData, `region.${region}.active`),
  );

  const languages = parseJsonField<ProductOption[]>(
    formData,
    "languagesJson",
    [],
  );
  const langLabel =
    languages.length > 0
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
      ageRating: parseOptionalString(formData, "ageRating"),
      showInStory: parseBoolean(formData, "showInStory"),
      series: parseOptionalString(formData, "series") as BookSeries | undefined,
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
        currencyCodes.map((currency) => [
          currency,
          parseCurrencyPricing(formData, currency),
        ]),
      ) as AdminProductPayload["product"]["pricing"],
      availableRegions,
      shipping: parseProductShipping(formData, localeCodes),
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
