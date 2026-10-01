import "server-only";

import { getTranslations } from "next-intl/server";
import { cache } from "react";

import { defaultLocale, type Locale } from "@/i18n/config";
import {
  type RegionCode,
  getLocalizedProductPath,
  isLocalizedProductSummary,
  localizeProductOptionGroups,
  localizeProductSummary,
  resolveOptionPrice,
  toPrintedLanguages,
  toProductDetails,
} from "@/utils";
import type { StoryTimelineBook } from "@/types/story";
import type {
  BookSeries,
  ProductDetailDocument,
  ProductDetailTranslation,
  ProductDocument,
  ProductPlacement,
  ProductPreview,
} from "@/types/catalog";
import type { RegionPricing } from "@/types/localization";
import { getRegionPricing } from "@/server/localization/localization.service";
import type { ProductDetails, ProductOption } from "@/types/product-details";
import type { CartItem, StoredCartItem } from "@/types/cart";
import { BOOK_FORMAT, BOOK_SERIES_VALUES } from "@/constants/catalog";
import {
  findActiveProductBySlug,
  findActiveProductsByIds,
  findActiveProductSlugs,
  findProductsByIds,
  findProductsForPlacement,
  findShopVisibleProducts,
  findSitemapProductSlugs,
} from "../repositories/products.repository";
import { findProductDetailsByProductId } from "../repositories/product-details.repository";
import { getPrintedStockAvailability } from "./printed-stock.service";
import { getApprovedReviewsForProduct } from "@/server/reviews/services/reviews.service";

const localizeProductSummaries = (
  products: ProductDocument[],
  locale: Locale,
  region: RegionCode,
  regionPricing: RegionPricing,
) =>
  products
    .map((product) =>
      localizeProductSummary(product, locale, region, regionPricing),
    )
    .filter(isLocalizedProductSummary);

export const getProductsForPlacement = cache(
  async (
    locale: Locale,
    region: RegionCode,
    placement: ProductPlacement,
    options?: {
      category?: string;
      limit?: number;
    },
  ) => {
    const [products, regionPricing] = await Promise.all([
      findProductsForPlacement(placement, region, options),
      getRegionPricing(region),
    ]);

    return localizeProductSummaries(products, locale, region, regionPricing);
  },
);

export const getShopProducts = cache(
  async (
    locale: Locale,
    region: RegionCode,
    options?: {
      category?: string;
      limit?: number;
    },
  ) => {
    const [products, regionPricing] = await Promise.all([
      findShopVisibleProducts(region, options),
      getRegionPricing(region),
    ]);

    return localizeProductSummaries(products, locale, region, regionPricing);
  },
);

export const getStoryTimelineBooks = cache(
  async (locale: Locale, region: RegionCode): Promise<StoryTimelineBook[]> => {
    const [products, regionPricing] = await Promise.all([
      findShopVisibleProducts(region),
      getRegionPricing(region),
    ]);
    const books = localizeProductSummaries(
      products.filter(
        (product) =>
          product.classification.type === "book" &&
          product.showInStory === true,
      ),
      locale,
      region,
      regionPricing,
    );

    const [detailsById, tSeries] = await Promise.all([
      Promise.all(
        books.map(
          async (book) =>
            [book.id, await findProductDetailsByProductId(book.id)] as const,
        ),
      ).then((entries) => new Map(entries)),
      getTranslations({ locale, namespace: "storefront.bookSeries" }),
    ]);

    return books.map((book) => {
      const detailTranslation =
        detailsById.get(book.id)?.translations[locale] ??
        detailsById.get(book.id)?.translations[defaultLocale];

      return {
        slug: book.slug,
        href: getLocalizedProductPath(locale, book.slug),
        title: book.title,
        subtitle: book.subtitle,
        emoji: book.emoji,
        ageRating: book.ageRating,
        storyLabel: detailTranslation?.storyLabel,
        seriesLabel: book.series ? tSeries(book.series) : undefined,
        thumbnail: book.thumbnail,
        thumbnailBackgroundColor: book.thumbnailBackgroundColor,
      };
    });
  },
);

export const getBookCountsBySeries = cache(
  async (region: RegionCode): Promise<Record<BookSeries, number>> => {
    const products = await findShopVisibleProducts(region);
    const counts = Object.fromEntries(
      BOOK_SERIES_VALUES.map((series) => [series, 0]),
    ) as Record<BookSeries, number>;

    for (const product of products) {
      if (
        product.classification.type === "book" &&
        product.series &&
        product.series in counts
      ) {
        counts[product.series] += 1;
      }
    }

    return counts;
  },
);

export const getProductSummariesByIds = async (
  locale: Locale,
  region: RegionCode,
  productIds: string[],
) => {
  const [products, regionPricing] = await Promise.all([
    findActiveProductsByIds(productIds),
    getRegionPricing(region),
  ]);
  const summaries = localizeProductSummaries(
    products,
    locale,
    region,
    regionPricing,
  );
  const productsById = new Map(
    summaries.map((product) => [product.id, product]),
  );

  return productIds
    .map((productId) => productsById.get(productId) ?? null)
    .filter(isLocalizedProductSummary);
};

export const getProductPreviewsByIds = async (
  locale: Locale,
  productIds: string[],
): Promise<Record<string, ProductPreview>> => {
  const products = await findProductsByIds(productIds);

  return Object.fromEntries(
    products.map((product) => {
      const translation =
        product.translations[locale] ?? product.translations[defaultLocale];

      return [
        product.productId,
        {
          id: product.productId,
          type: product.classification.type,
          emoji: translation?.thumbnail?.emoji ?? translation?.emoji,
          thumbnailSrc: translation?.thumbnail?.src,
          thumbnailBackgroundColor:
            translation?.thumbnail?.bgColor ??
            translation?.thumbnailBackgroundColor,
        },
      ];
    }),
  );
};

export type ProductDetailsResult =
  | { status: "ok"; product: ProductDetails }
  | { status: "not-found" }
  | { status: "out-of-region"; product: ProductDetails }
  | { status: "pricing-unavailable"; title: string };

export const getSitemapProductSlugs = cache(
  async (region: RegionCode): Promise<string[]> =>
    findSitemapProductSlugs(region),
);

export const getProductDetails = cache(
  async (
    locale: Locale,
    region: RegionCode,
    slug: string,
  ): Promise<ProductDetailsResult> => {
    const product = await findActiveProductBySlug(locale, slug);

    if (!product) {
      return { status: "not-found" };
    }

    const regionPricing = await getRegionPricing(region);
    const isOutOfRegion = !product.availableRegions?.includes(region);
    const summary = localizeProductSummary(
      product,
      locale,
      region,
      isOutOfRegion ? undefined : regionPricing,
      isOutOfRegion ? { ignoreRegion: true } : undefined,
    );

    if (!summary) {
      const isPriceable =
        regionPricing.status === "unavailable" &&
        product.availableRegions?.includes(region) &&
        !product.pricing[regionPricing.currency];

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
      isOutOfRegion ? undefined : regionPricing,
      toPrintedLanguages(product.shipping?.stockByLanguage, [region]),
    );

    if (!details) {
      return { status: "not-found" };
    }

    const approvedReviews = await getApprovedReviewsForProduct(
      summary.id,
      locale,
    );

    return {
      status: isOutOfRegion ? "out-of-region" : "ok",
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
  isPricingUnavailable: boolean;
  missingItemIds: string[];
  regionBlockedItemIds: string[];
};

export const resolveCartItems = async (
  locale: Locale,
  region: RegionCode,
  items: StoredCartItem[],
): Promise<ResolvedCart> => {
  const productIds = Array.from(new Set(items.map((item) => item.productId)));
  const [products, regionPricing] = await Promise.all([
    findActiveProductsByIds(productIds),
    getRegionPricing(region),
  ]);
  const catalogProductIds = new Set(
    products.map((product) => product.productId),
  );
  const summaryById = new Map(
    localizeProductSummaries(products, locale, region, regionPricing).map(
      (summary) => [summary.id, summary],
    ),
  );
  const detailsEntries = await Promise.all(
    productIds.map(
      async (productId) =>
        [productId, await findProductDetailsByProductId(productId)] as const,
    ),
  );
  const detailsById = new Map(detailsEntries);
  const stockAvailability = await getPrintedStockAvailability(
    items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      isDigital: item.selections?.format === BOOK_FORMAT.digital,
      language: item.selections?.language,
    })),
    region,
  );

  const resolvedItems = items.flatMap((item) => {
    const summary = summaryById.get(item.productId);

    if (!summary) {
      return [];
    }

    const translation = getDetailTranslation(
      detailsById.get(item.productId) ?? null,
      locale,
    );
    const availableQuantity = stockAvailability.get(item.id);
    const isOverStock =
      availableQuantity !== undefined && item.quantity > availableQuantity;

    return [
      {
        id: item.id,
        productId: item.productId,
        slug: summary.slug,
        title: summary.title,
        price: translation
          ? resolveOptionPrice(
              summary.price,
              localizeProductOptionGroups(translation, regionPricing),
              item.selections,
              summary.currency,
            )
          : summary.price,
        currency: summary.currency,
        emoji: summary.emoji,
        thumbnail: summary.thumbnail,
        thumbnailBackgroundColor: summary.thumbnailBackgroundColor,
        quantity: item.quantity,
        variant: buildVariantLabel(item, translation),
        isDigital: item.selections?.format === BOOK_FORMAT.digital,
        availability: isOverStock
          ? ("out_of_stock" as const)
          : summary.availability,
        availableQuantity,
      },
    ];
  });

  const missingItemIds = items
    .filter((item) => !catalogProductIds.has(item.productId))
    .map((item) => item.id);
  const regionBlockedItemIds = items
    .filter(
      (item) =>
        catalogProductIds.has(item.productId) &&
        !summaryById.has(item.productId),
    )
    .map((item) => item.id);

  return {
    items: resolvedItems,
    isPricingUnavailable:
      regionPricing.status === "unavailable" &&
      productIds.some((productId) => !summaryById.has(productId)),
    missingItemIds,
    regionBlockedItemIds,
  };
};

export const getProductSlugs = cache(async () => findActiveProductSlugs());
