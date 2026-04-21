import "server-only";

import type { Locale } from "@/i18n/config";
import type {
  AdminCategoryListItem,
  AdminCategoryUpsertInput,
  AdminCustomerListItem,
  AdminDashboardStats,
  AdminProductEditorData,
  AdminProductListItem,
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
  findAllProducts,
  findProductById,
  upsertProduct,
} from "../catalog/repositories/products.repository";

const getPrimaryTitle = (
  translations: Record<Locale, { title: string }>,
  locale: Locale = "ru",
) =>
  translations[locale]?.title ||
  translations.en?.title ||
  translations.ru?.title ||
  "—";

const booksCategoryKey = "books";

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
  locale: Locale = "ru",
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
): Promise<AdminProductEditorData> => {
  const categories = await findAllCategories();

  if (!productId) {
    const emptyPayload = createEmptyAdminProductPayload();

    if (categories[0]) {
      emptyPayload.product.classification.category = categories[0].key;
    }

    return {
      categories,
      payload: emptyPayload,
    };
  }

  const [product, details] = await Promise.all([
    findProductById(productId),
    findProductDetailsByProductId(productId),
  ]);

  if (!product || !details) {
    throw new Error(`Product ${productId} was not found`);
  }

  return {
    categories,
    payload: {
      product,
      details,
    },
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
      relatedProductIds: payload.details.relatedProductIds.filter(Boolean),
      translations: {
        ru: {
          ...payload.details.translations.ru,
          subtitle: payload.details.translations.ru.subtitle.trim(),
          badge: payload.details.translations.ru.badge?.trim() || undefined,
          storyLabel:
            payload.details.translations.ru.storyLabel?.trim() || undefined,
          storyTitle:
            payload.details.translations.ru.storyTitle?.trim() || undefined,
          description: payload.details.translations.ru.description.trim(),
        },
        en: {
          ...payload.details.translations.en,
          subtitle: payload.details.translations.en.subtitle.trim(),
          badge: payload.details.translations.en.badge?.trim() || undefined,
          storyLabel:
            payload.details.translations.en.storyLabel?.trim() || undefined,
          storyTitle:
            payload.details.translations.en.storyTitle?.trim() || undefined,
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

export const saveAdminProduct = async (payload: AdminProductPayload) => {
  const sanitizedPayload = sanitizeProductPayload(payload);

  await Promise.all([
    upsertProduct(sanitizedPayload.product),
    upsertProductDetails(sanitizedPayload.details),
  ]);

  return sanitizedPayload;
};

export const getAdminSummaryData = async (locale: Locale = "ru") => {
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
