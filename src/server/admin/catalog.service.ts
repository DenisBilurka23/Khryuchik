import "server-only";

import { defaultLocale, type Locale } from "@/i18n/config";
import type {
  AdminCategoryListItem,
  AdminCategoryUpsertInput,
  AdminCustomerListItem,
  AdminDashboardStats,
  AdminProductEditorData,
  AdminProductListItem,
  AdminProductOption,
  AdminProductPayload,
} from "@/types/admin";
import type { CategoryDocument } from "@/types/catalog";

import { createEmptyAdminProductPayload } from "@/utils/admin";
import {
  getAdminUsers,
  getAdminUsersStats,
} from "@/server/users/services/users.service";

import {
  countCategories,
  findAllCategories,
  upsertCategory,
} from "../catalog/repositories/categories.repository";
import {
  findAllProductDetails,
  findProductDetailsByProductId,
  upsertProductDetails,
} from "../catalog/repositories/product-details.repository";
import {
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

const booksCategoryKey = "books";

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

export const getAdminProducts = async (
  locale: Locale = defaultLocale,
): Promise<AdminProductListItem[]> => {
  const [products, detailsDocuments] = await Promise.all([
    findAllProducts(),
    findAllProductDetails(),
  ]);
  const detailsById = new Map(
    detailsDocuments.map((details) => [details.productId, details]),
  );

  return products.map((product) => {
    const details = detailsById.get(product.productId);
    const pricing = product.pricing.BY ?? product.pricing.US;
    const sku = details?.sku || "";

    return {
      productId: product.productId,
      title: getPrimaryTitle(product.translations, locale),
      slug: product.slug,
      type: product.classification.type,
      category: product.classification.category,
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
  const [categories, initialRelatedProductOptions] = await Promise.all([
    findAllCategories(),
    getAdminProductOptions({
      locale,
      excludeProductId: productId,
      limit: 10,
    }),
  ]);

  if (!productId) {
    const emptyPayload = createEmptyAdminProductPayload();

    if (categories[0]) {
      emptyPayload.product.classification.category = categories[0].key;
    }

    return {
      categories,
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
    initialRelatedProductOptions,
    payload: {
      product,
      details,
    },
    selectedRelatedProductOptions,
    selectedStoryProductOption,
  };
};

const normalizeCategoryTranslations = (
  translations: AdminCategoryUpsertInput["translations"],
): CategoryDocument["translations"] => ({
  ru: {
    label: translations.ru?.label?.trim() ?? "",
    description: translations.ru?.description?.trim() || undefined,
  },
  en: {
    label: translations.en?.label?.trim() ?? "",
    description: translations.en?.description?.trim() || undefined,
  },
});

export const saveAdminCategory = async (input: AdminCategoryUpsertInput) => {
  const category: CategoryDocument = {
    key: input.key.trim(),
    isActive: input.isActive,
    visibleInShop: input.visibleInShop,
    visibleInHomeTabs: input.visibleInHomeTabs,
    sortOrder: Number.isFinite(input.sortOrder) ? input.sortOrder : 100,
    translations: normalizeCategoryTranslations(input.translations),
  };

  if (
    !category.key ||
    !category.translations.ru?.label ||
    !category.translations.en?.label
  ) {
    throw new Error("Category key and both localized labels are required");
  }

  return upsertCategory(category);
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
      ? booksCategoryKey
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
    normalizedCategory === booksCategoryKey
  ) {
    throw new Error("Merch products cannot use the books category");
  }

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
      translations: {
        ru: {
          ...payload.product.translations.ru,
          title: payload.product.translations.ru.title.trim(),
          shortTitle:
            payload.product.translations.ru.shortTitle?.trim() || undefined,
          shortDescription:
            payload.product.translations.ru.shortDescription.trim(),
          currency: "BYN",
        },
        en: {
          ...payload.product.translations.en,
          title: payload.product.translations.en.title.trim(),
          shortTitle:
            payload.product.translations.en.shortTitle?.trim() || undefined,
          shortDescription:
            payload.product.translations.en.shortDescription.trim(),
          currency: "USD",
        },
      },
      pricing: {
        BY: {
          ...payload.product.pricing.BY,
          price: payload.product.pricing.BY?.price ?? 0,
          currency: "BYN",
        },
        US: {
          ...payload.product.pricing.US,
          price: payload.product.pricing.US?.price ?? 0,
          currency: "USD",
        },
      },
    },
    details: {
      ...payload.details,
      productId,
      sku,
      storyProductId: payload.details.storyProductId?.trim() || undefined,
      relatedProductIds: payload.details.relatedProductIds.filter(Boolean),
      translations: {
        ru: {
          ...payload.details.translations.ru,
          subtitle: payload.details.translations.ru.subtitle.trim(),
          badge: payload.details.translations.ru.badge?.trim() || undefined,
          storyLabel:
            payload.details.translations.ru.storyLabel?.trim() || undefined,
          description: payload.details.translations.ru.description.trim(),
        },
        en: {
          ...payload.details.translations.en,
          subtitle: payload.details.translations.en.subtitle.trim(),
          badge: payload.details.translations.en.badge?.trim() || undefined,
          storyLabel:
            payload.details.translations.en.storyLabel?.trim() || undefined,
          description: payload.details.translations.en.description.trim(),
        },
      },
    },
  };

  if (
    !nextPayload.product.translations.ru.title ||
    !nextPayload.product.translations.en.title
  ) {
    throw new Error("Product title is required for RU and EN locales");
  }

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
  const previousDetails = await findProductDetailsByProductId(
    sanitizedPayload.product.productId,
  );
  const removedObjectKeys = getRemovedObjectKeys({
    previousPayload: previousDetails,
    nextPayload: sanitizedPayload,
  });

  await Promise.all([
    upsertProduct(sanitizedPayload.product),
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
