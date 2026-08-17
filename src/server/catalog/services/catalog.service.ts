import "server-only";

import { cache } from "react";

import { defaultLocale, type Locale } from "@/i18n/config";
import {
  type CountryCode,
  isLocalizedProductSummary,
  localizeProductOptionGroups,
  localizeProductSummary,
  resolveOptionPrice,
  toProductDetails,
} from "@/utils";
import type {
  ProductDetailDocument,
  ProductDetailTranslation,
  ProductDocument,
  ProductPlacement,
} from "@/types/catalog";
import type { RegionPricing } from "@/types/localization";
import { getRegionPricing } from "@/server/localization/localization.service";
import type { ProductDetails, ProductOption } from "@/types/product-details";
import type { CartItem, StoredCartItem } from "@/types/cart";
import { BOOK_FORMAT } from "@/constants/catalog";
import {
  findActiveProductBySlug,
  findActiveProductsByIds,
  findActiveProductSlugs,
  findLatestBook,
  findProductsForPlacement,
  findShopVisibleProducts,
} from "../repositories/products.repository";
import { findProductDetailsByProductId } from "../repositories/product-details.repository";
import { getApprovedReviewsForProduct } from "@/server/reviews/services/reviews.service";

const localizeProductSummaries = (
  products: ProductDocument[],
  locale: Locale,
  country: CountryCode,
  regionPricing: RegionPricing,
) =>
  products
    .map((product) =>
      localizeProductSummary(product, locale, country, regionPricing),
    )
    .filter(isLocalizedProductSummary);

export const getProductsForPlacement = cache(
  async (
    locale: Locale,
    country: CountryCode,
    placement: ProductPlacement,
    options?: {
      category?: string;
      limit?: number;
    },
  ) => {
    const [products, regionPricing] = await Promise.all([
      findProductsForPlacement(placement, country, options),
      getRegionPricing(country),
    ]);

    return localizeProductSummaries(products, locale, country, regionPricing);
  },
);

export const getLatestBookSummary = cache(
  async (locale: Locale, country: CountryCode) => {
    const product = await findLatestBook(country);

    if (!product) {
      return null;
    }

    const summary = localizeProductSummary(
      product,
      locale,
      country,
      await getRegionPricing(country),
    );

    return isLocalizedProductSummary(summary) ? summary : null;
  },
);

export const getShopProducts = cache(
  async (
    locale: Locale,
    country: CountryCode,
    options?: {
      category?: string;
      limit?: number;
    },
  ) => {
    const [products, regionPricing] = await Promise.all([
      findShopVisibleProducts(country, options),
      getRegionPricing(country),
    ]);

    return localizeProductSummaries(products, locale, country, regionPricing);
  },
);

export const getProductSummariesByIds = async (
  locale: Locale,
  country: CountryCode,
  productIds: string[],
) => {
  const [products, regionPricing] = await Promise.all([
    findActiveProductsByIds(productIds),
    getRegionPricing(country),
  ]);
  const summaries = localizeProductSummaries(
    products,
    locale,
    country,
    regionPricing,
  );
  const productsById = new Map(
    summaries.map((product) => [product.id, product]),
  );

  return productIds
    .map((productId) => productsById.get(productId) ?? null)
    .filter(isLocalizedProductSummary);
};

export type ProductDetailsResult =
  | { status: "ok"; product: ProductDetails }
  | { status: "not-found" }
  | { status: "pricing-unavailable"; title: string };

export const getProductDetails = cache(
  async (
    locale: Locale,
    country: CountryCode,
    slug: string,
  ): Promise<ProductDetailsResult> => {
    const product = await findActiveProductBySlug(locale, slug);

    if (!product) {
      return { status: "not-found" };
    }

    const regionPricing = await getRegionPricing(country);
    const summary = localizeProductSummary(
      product,
      locale,
      country,
      regionPricing,
    );

    if (!summary) {
      const isPriceable =
        regionPricing.status === "unavailable" &&
        product.availableRegions?.includes(country) &&
        !product.pricing[country];

      if (!isPriceable) {
        return { status: "not-found" };
      }

      const translation =
        product.translations[locale] ?? product.translations[defaultLocale];

      return {
        status: "pricing-unavailable",
        title: translation?.title ?? product.slug,
      };
    }

    const detailsDocument = await findProductDetailsByProductId(summary.id);

    if (!detailsDocument) {
      return { status: "not-found" };
    }

    const details = toProductDetails(
      summary,
      detailsDocument,
      product.printify?.variants,
      locale,
      country,
      regionPricing,
    );

    if (!details) {
      return { status: "not-found" };
    }

    const approvedReviews = await getApprovedReviewsForProduct(
      summary.id,
      locale,
    );

    return {
      status: "ok",
      product: {
        ...details,
        reviews: [...details.reviews, ...approvedReviews],
      },
    };
  },
);

const getSelectionLabel = (
  options: ProductOption[] | undefined,
  value: string | undefined,
) => {
  if (!value) {
    return null;
  }

  return options?.find((option) => option.value === value)?.label ?? value;
};

const getDetailTranslation = (
  detailsDocument: ProductDetailDocument | null,
  locale: Locale,
) =>
  detailsDocument?.translations[locale] ??
  detailsDocument?.translations[defaultLocale] ??
  null;

const buildVariantLabel = (
  item: StoredCartItem,
  translation: ProductDetailTranslation | null,
) => {
  if (!translation || !item.selections) {
    return undefined;
  }

  const variant = [
    getSelectionLabel(translation.languages, item.selections.language),
    getSelectionLabel(translation.formats, item.selections.format),
    getSelectionLabel(translation.sizes, item.selections.size),
    getSelectionLabel(translation.colors, item.selections.color),
  ]
    .filter(Boolean)
    .join(" / ");

  return variant || undefined;
};

export type ResolvedCart = {
  items: CartItem[];
  // True when items dropped out because the region's exchange rate could not be
  // established, which is a temporary failure the customer should see rather
  // than a cart that quietly lost a line.
  isPricingUnavailable: boolean;
};

export const resolveCartItems = async (
  locale: Locale,
  country: CountryCode,
  items: StoredCartItem[],
): Promise<ResolvedCart> => {
  const productIds = Array.from(new Set(items.map((item) => item.productId)));
  const [summaries, regionPricing] = await Promise.all([
    getProductSummariesByIds(locale, country, productIds),
    getRegionPricing(country),
  ]);
  const summaryById = new Map(
    summaries.map((summary) => [summary.id, summary]),
  );
  const detailsEntries = await Promise.all(
    productIds.map(
      async (productId) =>
        [productId, await findProductDetailsByProductId(productId)] as const,
    ),
  );
  const detailsById = new Map(detailsEntries);

  const resolvedItems = items.flatMap((item) => {
    const summary = summaryById.get(item.productId);

    if (!summary) {
      return [];
    }

    const translation = getDetailTranslation(
      detailsById.get(item.productId) ?? null,
      locale,
    );

    return [
      {
        id: item.id,
        productId: item.productId,
        slug: summary.slug,
        title: summary.title,
        price: translation
          ? resolveOptionPrice(
              summary.price,
              localizeProductOptionGroups(translation, country, regionPricing),
              item.selections,
              country,
            )
          : summary.price,
        currency: summary.currency,
        emoji: summary.emoji,
        thumbnail: summary.thumbnail,
        thumbnailBackgroundColor: summary.thumbnailBackgroundColor,
        quantity: item.quantity,
        variant: buildVariantLabel(item, translation),
        isDigital: item.selections?.format === BOOK_FORMAT.digital,
      },
    ];
  });

  return {
    items: resolvedItems,
    isPricingUnavailable:
      regionPricing.status === "unavailable" &&
      productIds.some((productId) => !summaryById.has(productId)),
  };
};

export const getProductSlugs = cache(async () => findActiveProductSlugs());
