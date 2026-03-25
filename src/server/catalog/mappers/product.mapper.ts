import "server-only";

import type { Locale } from "@/i18n/config";
import type {
  LocalizedProductSummary,
  ProductDetailDocument,
  ProductDocument,
} from "@/types/catalog";
import type { ProductDetails } from "@/types/product-details";

export const localizeProductSummary = (
  product: ProductDocument,
  locale: Locale,
): LocalizedProductSummary | null => {
  const translation = product.translations[locale];

  if (!translation) {
    return null;
  }

  const searchIndex = Object.values(product.translations)
    .flatMap((localizedTranslation) => [
      localizedTranslation.title,
      localizedTranslation.shortTitle,
      localizedTranslation.shortDescription,
      localizedTranslation.slug,
    ])
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();

  return {
    id: product.productId,
    type: product.classification.type,
    category: product.classification.category,
    searchIndex,
    isActive: product.status.isActive,
    featured: product.merchandising.featured,
    sortOrder: product.merchandising.sortOrder,
    placements: product.merchandising.placements,
    availability: product.inventory.availability,
    trackQuantity: product.inventory.trackQuantity,
    quantity: product.inventory.quantity,
    allowBackorder: product.inventory.allowBackorder,
    merchandisingFlags: product.merchandising.flags,
    ...translation,
  };
};

export const isLocalizedProductSummary = (
  product: LocalizedProductSummary | null,
): product is LocalizedProductSummary => product !== null;

export const toProductDetails = (
  summary: LocalizedProductSummary,
  detailsDocument: ProductDetailDocument,
  locale: Locale,
): ProductDetails | null => {
  const translation = detailsDocument.translations[locale];

  if (!translation) {
    return null;
  }

  return {
    slug: summary.slug,
    title: summary.title,
    subtitle: translation.subtitle,
    price: summary.price,
    oldPrice: translation.oldPrice,
    badge: translation.badge,
    storyLabel: translation.storyLabel,
    storyTitle: translation.storyTitle,
    sku: translation.sku,
    description: translation.description,
    images: translation.images,
    languages: translation.languages,
    formats: translation.formats,
    sizes: translation.sizes,
    colors: translation.colors,
    specs: translation.specs,
    delivery: translation.delivery,
    reviews: translation.reviews,
    relatedIds: detailsDocument.relatedProductIds,
  };
};