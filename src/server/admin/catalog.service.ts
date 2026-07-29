import "server-only";

import { BOOKS_CATEGORY_KEY } from "@/constants/catalog";
import { defaultLocale, type Locale } from "@/i18n/config";
import type {
  AdminCategoryListItem,
  AdminCategoryUpsertInput,
  AdminCustomerEditorData,
  AdminCustomerListItem,
  AdminDashboardStats,
  AdminProductEditorData,
  AdminProductListItem,
  AdminProductOption,
  AdminProductPayload,
} from "@/types/admin";
import type {
  CategoryDocument,
  CategoryTranslation,
  ProductDetailDocument,
  ProductDetailTranslation,
  ProductTranslation,
} from "@/types/catalog";

import {
  buildUniqueValue,
  createEmptyAdminProductPayload,
  ensureProductPayloadCoverage,
  getAdminCategoryLabel,
  normalizeIdentifierPart,
} from "@/utils/admin";
import {
  getActiveLocales,
  getActiveRegions,
} from "@/server/localization/localization.service";
import {
  deleteAdminUserAccount,
  getAdminUserEditorData,
  getAdminUsers,
  getAdminUsersStats,
  updateAdminUserAccount,
} from "@/server/users/services/users.service";

import {
  countCategories,
  deleteCategoryByKey,
  findAllCategories,
  upsertCategory,
} from "../catalog/repositories/categories.repository";
import {
  deleteProductDetailsByProductId,
  findAllProductDetails,
  findProductDetailsByProductId,
  removeProductReferencesFromDetails,
  upsertProductDetails,
} from "../catalog/repositories/product-details.repository";
import {
  countProductsByCategoryKey,
  deleteProductById,
  findAdminProductsForSearch,
  findAllProducts,
  findProductById,
  findProductsByIds,
  upsertProduct,
} from "../catalog/repositories/products.repository";
import {
  deleteBookAssetObjects,
  deleteProductGalleryObjects,
} from "../storage/r2-assets.service";

const getPrimaryTitle = (
  translations: Record<Locale, { title: string }>,
  locale: Locale = defaultLocale,
) =>
  translations[locale]?.title ||
  translations.en?.title ||
  translations.ru?.title ||
  "—";

export const adminCategoryDeleteErrorCodes = {
  InvalidKey: "invalid-key",
  NotEmpty: "not-empty",
  Protected: "protected",
} as const;

export type AdminCategoryDeleteErrorCode =
  (typeof adminCategoryDeleteErrorCodes)[keyof typeof adminCategoryDeleteErrorCodes];

export class AdminCategoryDeleteError extends Error {
  code: AdminCategoryDeleteErrorCode;

  constructor(code: AdminCategoryDeleteErrorCode) {
    super(code);
    this.code = code;
    this.name = "AdminCategoryDeleteError";
  }
}

type AdminProductOptionsQuery = {
  locale: Locale;
  productIds?: string[];
  query?: string;
  excludeProductId?: string;
  limit?: number;
};

const mapProductsToAdminOptions = (
  products: Array<{
    productId: string;
    slug: string;
    translations: Record<Locale, { title: string }>;
  }>,
  locale: Locale,
): AdminProductOption[] =>
  products.map((product) => ({
    id: product.productId,
    title: getPrimaryTitle(product.translations, locale),
    slug: product.slug,
  }));

export const getAdminProductOptions = async ({
  locale,
  productIds,
  query,
  excludeProductId,
  limit = 10,
}: AdminProductOptionsQuery): Promise<AdminProductOption[]> => {
  if (productIds && productIds.length > 0) {
    const products = await findProductsByIds(productIds);
    const productsById = new Map(
      products.map((product) => [product.productId, product]),
    );

    return productIds
      .map((productId) => productsById.get(productId))
      .filter((product): product is NonNullable<typeof product> =>
        Boolean(product),
      )
      .map((product) => ({
        id: product.productId,
        title: getPrimaryTitle(product.translations, locale),
        slug: product.slug,
      }));
  }

  const products = await findAdminProductsForSearch(locale, {
    query,
    excludeProductId,
    limit,
  });

  return mapProductsToAdminOptions(products, locale);
};

const getCategoryItemsCountMap = async () => {
  const products = await findAllProducts();

  return products.reduce<Record<string, number>>((accumulator, product) => {
    const key = product.classification.category;
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});
};

export const getAdminDashboardStats =
  async (): Promise<AdminDashboardStats> => {
    const [products, categoriesCount, usersStats] = await Promise.all([
      findAllProducts(),
      countCategories(),
      getAdminUsersStats(),
    ]);

    return {
      totalProducts: products.length,
      activeProducts: products.filter((product) => product.status.isActive)
        .length,
      booksCount: products.filter(
        (product) => product.classification.type === "book",
      ).length,
      categoriesCount,
      totalUsers: usersStats.totalUsers,
      adminUsers: usersStats.adminUsers,
    };
  };

export const getAdminCustomers = async (
  limit?: number,
): Promise<AdminCustomerListItem[]> => {
  const users = await getAdminUsers(limit);

  return users.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    isAdmin: user.isAdmin,
    authProviders: user.authProviders,
    createdAt: user.createdAt.toISOString(),
  }));
};

export const getAdminCustomerEditorData = async (
  userId: string,
): Promise<AdminCustomerEditorData | null> => getAdminUserEditorData(userId);

export const saveAdminCustomer = async (
  actorUserId: string,
  userId: string,
  input: {
    email: string;
    name: string;
    phone: string;
    isAdmin: boolean;
    image?: string | null;
    avatarObjectKey?: string | null;
  },
) => updateAdminUserAccount(actorUserId, userId, input);

export const deleteAdminCustomer = async (
  actorUserId: string,
  userId: string,
) => deleteAdminUserAccount(actorUserId, userId);

export const getAdminProducts = async (
  locale: Locale = defaultLocale,
): Promise<AdminProductListItem[]> => {
  const [products, detailsDocuments, categories] = await Promise.all([
    findAllProducts(),
    findAllProductDetails(),
    findAllCategories(),
  ]);
  const detailsById = new Map(
    detailsDocuments.map((details) => [details.productId, details]),
  );
  const categoriesByKey = new Map(
    categories.map((category) => [category.key, category]),
  );

  return products.map((product) => {
    const details = detailsById.get(product.productId);
    const category = categoriesByKey.get(product.classification.category);
    const pricing = Object.values(product.pricing)[0];
    const sku = details?.sku || "";

    return {
      productId: product.productId,
      title: getPrimaryTitle(product.translations, locale),
      slug: product.slug,
      type: product.classification.type,
      category: product.classification.category,
      categoryLabel:
        getAdminCategoryLabel(category?.translations ?? {}, locale) ||
        product.classification.category,
      sku,
      priceLabel: pricing ? `${pricing.price} ${pricing.currency}` : "—",
      availability: product.inventory.availability,
      isActive: product.status.isActive,
      visibleInShop: product.status.visibleInShop,
      sortOrder: product.merchandising.sortOrder,
    };
  });
};

export const getAdminCategories = async (): Promise<
  AdminCategoryListItem[]
> => {
  const [categories, itemsCountByCategory] = await Promise.all([
    findAllCategories(),
    getCategoryItemsCountMap(),
  ]);

  return categories.map((category) => ({
    key: category.key,
    isActive: category.isActive,
    visibleInShop: category.visibleInShop,
    visibleInHomeTabs: category.visibleInHomeTabs,
    sortOrder: category.sortOrder,
    itemsCount: itemsCountByCategory[category.key] ?? 0,
    translations: category.translations,
  }));
};

export const getAdminProductEditorData = async (
  productId?: string,
  locale: Locale = defaultLocale,
): Promise<AdminProductEditorData> => {
  const [
    categories,
    activeLocales,
    activeRegions,
    initialRelatedProductOptions,
  ] = await Promise.all([
    findAllCategories(),
    getActiveLocales(),
    getActiveRegions(),
    getAdminProductOptions({
      locale,
      excludeProductId: productId,
      limit: 10,
    }),
  ]);
  const localeCodes = activeLocales.map((item) => item.code);
  const regionCodes = activeRegions.map((item) => item.code);

  if (!productId) {
    const emptyPayload = createEmptyAdminProductPayload(localeCodes);

    if (categories[0]) {
      emptyPayload.product.classification.category = categories[0].key;
    }

    return {
      categories,
      activeLocales,
      activeRegions,
      initialRelatedProductOptions,
      payload: emptyPayload,
      selectedRelatedProductOptions: [],
      selectedStoryProductOption: undefined,
    };
  }

  const [product, details] = await Promise.all([
    findProductById(productId),
    findProductDetailsByProductId(productId),
  ]);

  if (!product || !details) {
    throw new Error(`Product ${productId} was not found`);
  }

  const selectedRelatedProductOptions = await getAdminProductOptions({
    locale,
    productIds: details.relatedProductIds,
  });
  const [selectedStoryProductOption] = details.storyProductId
    ? await getAdminProductOptions({
        locale,
        productIds: [details.storyProductId],
      })
    : [];

  return {
    categories,
    activeLocales,
    activeRegions,
    initialRelatedProductOptions,
    payload: ensureProductPayloadCoverage(
      { product, details },
      localeCodes,
      regionCodes,
    ),
    selectedRelatedProductOptions,
    selectedStoryProductOption,
  };
};

const normalizeCategoryTranslations = (
  translations: AdminCategoryUpsertInput["translations"],
): Record<Locale, CategoryTranslation> => ({
  ru: {
    label: translations.ru?.label?.trim() ?? "",
  },
  en: {
    label: translations.en?.label?.trim() ?? "",
  },
});

const resolveAdminCategoryKey = async (
  input: AdminCategoryUpsertInput,
  translations: ReturnType<typeof normalizeCategoryTranslations>,
) => {
  const requestedKey = input.key?.trim();

  if (requestedKey) {
    return requestedKey;
  }

  const categories = await findAllCategories();
  const takenKeys = new Set(categories.map((category) => category.key));
  const generatedBaseKey =
    normalizeIdentifierPart(translations.en.label) || "category";

  return buildUniqueValue(generatedBaseKey, (candidate) =>
    takenKeys.has(candidate),
  );
};

export const saveAdminCategory = async (input: AdminCategoryUpsertInput) => {
  const translations = normalizeCategoryTranslations(input.translations);
  const key = await resolveAdminCategoryKey(input, translations);
  const category: CategoryDocument = {
    key,
    isActive: input.isActive,
    visibleInShop: input.visibleInShop,
    visibleInHomeTabs: input.visibleInHomeTabs,
    sortOrder: Number.isFinite(input.sortOrder) ? input.sortOrder : 100,
    translations,
  };

  if (!category.translations.ru?.label || !category.translations.en?.label) {
    throw new Error("Both localized labels are required");
  }

  return upsertCategory(category);
};

export const deleteAdminCategory = async (key: string) => {
  const normalizedKey = key.trim();

  if (!normalizedKey) {
    throw new AdminCategoryDeleteError(
      adminCategoryDeleteErrorCodes.InvalidKey,
    );
  }

  if (normalizedKey === BOOKS_CATEGORY_KEY) {
    throw new AdminCategoryDeleteError(adminCategoryDeleteErrorCodes.Protected);
  }

  const linkedProductsCount = await countProductsByCategoryKey(normalizedKey);

  if (linkedProductsCount > 0) {
    throw new AdminCategoryDeleteError(adminCategoryDeleteErrorCodes.NotEmpty);
  }

  await deleteCategoryByKey(normalizedKey);
};

const getDetailObjectKeys = (
  details: ProductDetailDocument | null | undefined,
) => {
  if (!details) {
    return {
      galleryObjectKeys: [] as string[],
      assetObjectKeys: [] as string[],
    };
  }

  return {
    galleryObjectKeys: Object.values(details.translations)
      .flatMap((translation) => translation.images)
      .map((image) => image.objectKey)
      .filter((objectKey): objectKey is string => Boolean(objectKey)),
    assetObjectKeys: Object.values(details.translations)
      .flatMap((translation) => translation.digitalAssets ?? [])
      .map((asset) => asset.objectKey)
      .filter((objectKey): objectKey is string => Boolean(objectKey)),
  };
};

export const deleteAdminProduct = async (productId: string) => {
  const normalizedProductId = productId.trim();

  if (!normalizedProductId) {
    throw new Error("Product ID is required");
  }

  const [product, details] = await Promise.all([
    findProductById(normalizedProductId),
    findProductDetailsByProductId(normalizedProductId),
  ]);

  if (!product) {
    throw new Error("Product not found");
  }

  const removedObjectKeys = getDetailObjectKeys(details);

  await Promise.all([
    deleteProductById(normalizedProductId),
    deleteProductDetailsByProductId(normalizedProductId),
    removeProductReferencesFromDetails(normalizedProductId),
  ]);

  await Promise.allSettled([
    deleteProductGalleryObjects(removedObjectKeys.galleryObjectKeys),
    deleteBookAssetObjects(removedObjectKeys.assetObjectKeys),
  ]);

  return {
    productId: normalizedProductId,
    slug: product.slug,
  };
};

const sanitizeProductPayload = (
  payload: AdminProductPayload,
): AdminProductPayload => {
  const productId = payload.product.productId.trim();
  const slug = payload.product.slug.trim();
  const sku = payload.details.sku.trim();
  const requestedCategory = payload.product.classification.category.trim();
  const normalizedCategory =
    payload.product.classification.type === "book"
      ? BOOKS_CATEGORY_KEY
      : requestedCategory;

  if (!productId) {
    throw new Error("Product ID is required");
  }

  if (!slug) {
    throw new Error("Slug is required");
  }

  if (!normalizedCategory) {
    throw new Error("Category is required");
  }

  if (
    payload.product.classification.type === "merch" &&
    normalizedCategory === BOOKS_CATEGORY_KEY
  ) {
    throw new Error("Merch products cannot use the books category");
  }

  // Only the languages toggled on ("Add for this language") reach the parser,
  // so every entry here must have its required fields filled in. Languages left
  // off fall back to the default-locale content on the storefront.
  const publishedLocaleCodes = Object.keys(payload.product.translations);
  const regionCodes = Object.keys(payload.product.pricing);

  if (!publishedLocaleCodes.includes(defaultLocale)) {
    throw new Error("The default language is required");
  }

  for (const code of publishedLocaleCodes) {
    const translation = payload.product.translations[code];
    const detail = payload.details.translations[code];

    if (
      !translation?.title.trim() ||
      !translation?.shortDescription.trim() ||
      !detail?.subtitle.trim()
    ) {
      throw new Error(`Missing required fields for language "${code}"`);
    }
  }

  const availableRegions = (payload.product.availableRegions ?? []).filter(
    (code) => regionCodes.includes(code),
  );

  // Display currency is sourced from per-region pricing downstream, so the
  // per-translation currency only needs to be a valid placeholder.
  const fallbackCurrency =
    regionCodes
      .map((code) => payload.product.pricing[code]?.currency?.trim())
      .find((currency): currency is string => Boolean(currency)) ?? "USD";

  const nextPayload: AdminProductPayload = {
    product: {
      ...payload.product,
      productId,
      classification: {
        ...payload.product.classification,
        category: normalizedCategory,
      },
      merchandising: {
        ...payload.product.merchandising,
      },
      slug,
      availableRegions,
      translations: Object.fromEntries(
        publishedLocaleCodes.map((locale) => {
          const translation = payload.product.translations[locale];
          const image = payload.details.translations[locale]?.images[0];
          return [
            locale,
            {
              ...translation,
              title: translation.title.trim(),
              shortTitle: translation.shortTitle?.trim() || undefined,
              shortDescription: translation.shortDescription.trim(),
              currency: fallbackCurrency,
              thumbnail: image,
            },
          ];
        }),
      ) as Record<Locale, ProductTranslation>,
      pricing: Object.fromEntries(
        regionCodes.map((code) => {
          const regionPricing = payload.product.pricing[code];
          return [
            code,
            {
              ...regionPricing,
              price: regionPricing?.price ?? 0,
              currency: regionPricing?.currency?.trim() || fallbackCurrency,
              oldPrice: regionPricing?.oldPrice,
            },
          ];
        }),
      ) as AdminProductPayload["product"]["pricing"],
    },
    details: {
      ...payload.details,
      productId,
      sku,
      storyProductId: payload.details.storyProductId?.trim() || undefined,
      relatedProductIds: payload.details.relatedProductIds.filter(Boolean),
      translations: Object.fromEntries(
        publishedLocaleCodes.map((locale) => {
          const t = payload.details.translations[locale];
          return [
            locale,
            {
              ...t,
              subtitle: t.subtitle.trim(),
              badge: t.badge?.trim() || undefined,
              storyLabel: t.storyLabel?.trim() || undefined,
              description: t.description.trim(),
            },
          ];
        }),
      ) as Record<Locale, ProductDetailTranslation>,
    },
  };

  return nextPayload;
};

const getRemovedObjectKeys = ({
  previousPayload,
  nextPayload,
}: {
  previousPayload?: Awaited<ReturnType<typeof findProductDetailsByProductId>>;
  nextPayload: AdminProductPayload;
}) => {
  if (!previousPayload) {
    return {
      galleryObjectKeys: [] as string[],
      assetObjectKeys: [] as string[],
    };
  }

  const previousGalleryObjectKeys = new Set(
    Object.values(previousPayload.translations)
      .flatMap((translation) => translation.images)
      .map((image) => image.objectKey)
      .filter((objectKey): objectKey is string => Boolean(objectKey)),
  );
  const nextGalleryObjectKeys = new Set(
    Object.values(nextPayload.details.translations)
      .flatMap((translation) => translation.images)
      .map((image) => image.objectKey)
      .filter((objectKey): objectKey is string => Boolean(objectKey)),
  );
  const previousAssetObjectKeys = new Set(
    Object.values(previousPayload.translations)
      .flatMap((translation) => translation.digitalAssets ?? [])
      .map((asset) => asset.objectKey)
      .filter(Boolean),
  );
  const nextAssetObjectKeys = new Set(
    Object.values(nextPayload.details.translations)
      .flatMap((translation) => translation.digitalAssets ?? [])
      .map((asset) => asset.objectKey)
      .filter(Boolean),
  );

  return {
    galleryObjectKeys: [...previousGalleryObjectKeys].filter(
      (objectKey) => !nextGalleryObjectKeys.has(objectKey),
    ),
    assetObjectKeys: [...previousAssetObjectKeys].filter(
      (objectKey) => !nextAssetObjectKeys.has(objectKey),
    ),
  };
};

export const saveAdminProduct = async (payload: AdminProductPayload) => {
  const sanitizedPayload = sanitizeProductPayload(payload);
  const [previousDetails, previousProduct] = await Promise.all([
    findProductDetailsByProductId(sanitizedPayload.product.productId),
    findProductById(sanitizedPayload.product.productId),
  ]);

  if (!sanitizedPayload.product.printify && previousProduct?.printify) {
    sanitizedPayload.product.printify = previousProduct.printify;
  }

  if (sanitizedPayload.product.printify && previousProduct) {
    sanitizedPayload.product.inventory = previousProduct.inventory;
  }

  const removedObjectKeys = getRemovedObjectKeys({
    previousPayload: previousDetails,
    nextPayload: sanitizedPayload,
  });

  const hasOptions = Object.values(sanitizedPayload.details.translations).some(
    (t) =>
      (t.languages?.length ?? 0) > 0 ||
      (t.formats?.length ?? 0) > 0 ||
      (t.sizes?.length ?? 0) > 0 ||
      (t.colors?.length ?? 0) > 0,
  );

  await Promise.all([
    upsertProduct({ ...sanitizedPayload.product, hasOptions }),
    upsertProductDetails(sanitizedPayload.details),
  ]);

  await Promise.allSettled([
    deleteProductGalleryObjects(removedObjectKeys.galleryObjectKeys),
    deleteBookAssetObjects(removedObjectKeys.assetObjectKeys),
  ]);

  return sanitizedPayload;
};

export const getAdminSummaryData = async (locale: Locale = defaultLocale) => {
  const [stats, products, categories, customers] = await Promise.all([
    getAdminDashboardStats(),
    getAdminProducts(locale),
    getAdminCategories(),
    getAdminCustomers(5),
  ]);

  return {
    stats,
    recentProducts: products.slice(0, 5),
    categories: categories.slice(0, 5),
    recentCustomers: customers,
    hasOrdersData: false,
  };
};
