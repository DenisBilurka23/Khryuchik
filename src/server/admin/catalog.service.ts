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
  translations: Record<Locale, { title: string; slug: string }>,
  locale: Locale = "ru",
) =>
  translations[locale]?.title ||
  translations.en?.title ||
  translations.ru?.title ||
  "—";

const getPrimarySlug = (
  translations: Record<Locale, { title: string; slug: string }>,
  locale: Locale = "ru",
) =>
  translations[locale]?.slug ||
  translations.en?.slug ||
  translations.ru?.slug ||
  "";

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
      featuredCount: products.filter(
        (product) => product.merchandising.featured,
      ).length,
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
    const sku =
      details?.translations.ru?.sku || details?.translations.en?.sku || "";

    return {
      productId: product.productId,
      title: getPrimaryTitle(product.translations, locale),
      slug: getPrimarySlug(product.translations, locale),
      type: product.classification.type,
      category: product.classification.category,
      sku,
      priceLabel: pricing ? `${pricing.price} ${pricing.currency}` : "—",
      availability: product.inventory.availability,
      isActive: product.status.isActive,
      visibleInShop: product.status.visibleInShop,
      featured: product.merchandising.featured,
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

  if (!productId) {
    throw new Error("Product ID is required");
  }

  const nextPayload: AdminProductPayload = {
    product: {
      ...payload.product,
      productId,
      classification: {
        ...payload.product.classification,
        category: payload.product.classification.category.trim(),
      },
      merchandising: {
        ...payload.product.merchandising,
        flags: payload.product.merchandising.flags.filter(Boolean),
      },
      translations: {
        ru: {
          ...payload.product.translations.ru,
          slug: payload.product.translations.ru.slug.trim(),
          title: payload.product.translations.ru.title.trim(),
          shortTitle:
            payload.product.translations.ru.shortTitle?.trim() || undefined,
          shortDescription:
            payload.product.translations.ru.shortDescription.trim(),
        },
        en: {
          ...payload.product.translations.en,
          slug: payload.product.translations.en.slug.trim(),
          title: payload.product.translations.en.title.trim(),
          shortTitle:
            payload.product.translations.en.shortTitle?.trim() || undefined,
          shortDescription:
            payload.product.translations.en.shortDescription.trim(),
        },
      },
      pricing: {
        BY: payload.product.pricing.BY,
        US: payload.product.pricing.US,
      },
    },
    details: {
      ...payload.details,
      productId,
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
          sku: payload.details.translations.ru.sku.trim(),
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
          sku: payload.details.translations.en.sku.trim(),
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
