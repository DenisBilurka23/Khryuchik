import "server-only";

import type { Locale } from "@/i18n/config";
import { defaultCountry } from "@/lib/countries";
import type { CountryCode } from "@/lib/countries";
import type {
  LocalizedProductSummary,
  ProductDetailDocument,
  ProductDocument,
} from "@/types/catalog";
import type { ProductDetails } from "@/types/product-details";

const localizeDeliveryCopy = (
  delivery: string[],
  locale: Locale,
  country: CountryCode,
) => {
  if (country === "BY") {
    return delivery;
  }

  return delivery.map((item) => {
    if (locale === "ru") {
      return item
        .replaceAll("по Беларуси", "по США")
        .replaceAll("по Беларуси и в другие страны", "по США и в другие страны")
        .replaceAll("Международная доставка", "Доставка в другие страны")
        .replaceAll("Международная", "Международная");
    }

    return item
      .replaceAll("across Belarus", "across the USA")
      .replaceAll("across Belarus and internationally", "across the USA and internationally")
      .replaceAll("ships across Belarus", "ships across the USA")
      .replaceAll("Shipping across Belarus", "Shipping across the USA")
      .replaceAll("Printed edition ships across Belarus", "Printed edition ships across the USA");
  });
};

export const localizeProductSummary = (
  product: ProductDocument,
  locale: Locale,
  country: CountryCode,
): LocalizedProductSummary | null => {
  const translation = product.translations[locale];
  const pricing = product.pricing[country] ?? product.pricing[defaultCountry];

  if (!translation || !pricing) {
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
    price: pricing.price,
    currency: pricing.currency,
    oldPrice: pricing.oldPrice,
  };
};

export const isLocalizedProductSummary = (
  product: LocalizedProductSummary | null,
): product is LocalizedProductSummary => product !== null;

export const toProductDetails = (
  summary: LocalizedProductSummary,
  detailsDocument: ProductDetailDocument,
  locale: Locale,
  country: CountryCode,
): ProductDetails | null => {
  const translation = detailsDocument.translations[locale];

  if (!translation) {
    return null;
  }

  return {
    productId: summary.id,
    slug: summary.slug,
    title: summary.title,
    subtitle: translation.subtitle,
    price: summary.price,
    currency: summary.currency,
    oldPrice: summary.oldPrice,
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
    delivery: localizeDeliveryCopy(translation.delivery, locale, country),
    reviews: translation.reviews,
    relatedIds: detailsDocument.relatedProductIds,
  };
};