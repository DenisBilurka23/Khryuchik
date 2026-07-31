import { defaultLocale, type Locale } from "@/i18n/config";
import type {
  LocalizedProductSummary,
  ProductDetailDocument,
  ProductDocument,
} from "@/types/catalog";
import type { CartSelections } from "@/types/cart";
import type {
  ProductDetails,
  ProductOption,
  ProductOptionGroups,
} from "@/types/product-details";

import type { CountryCode } from "./country";

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
      .replaceAll(
        "across Belarus and internationally",
        "across the USA and internationally",
      )
      .replaceAll("ships across Belarus", "ships across the USA")
      .replaceAll("Shipping across Belarus", "Shipping across the USA")
      .replaceAll(
        "Printed edition ships across Belarus",
        "Printed edition ships across the USA",
      );
  });
};

export const localizeProductSummary = (
  product: ProductDocument,
  locale: Locale,
  country: CountryCode,
): LocalizedProductSummary | null => {
  if (!product.availableRegions?.includes(country)) {
    return null;
  }
  const translation =
    product.translations[locale] ?? product.translations[defaultLocale];
  const pricing = product.pricing[country];

  if (!translation || !pricing) {
    return null;
  }

  const searchIndex = Object.values(product.translations)
    .flatMap((localizedTranslation) => [
      localizedTranslation.title,
      localizedTranslation.shortTitle,
      localizedTranslation.shortDescription,
    ])
    .concat(product.slug)
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();

  return {
    id: product.productId,
    slug: product.slug,
    type: product.classification.type,
    category: product.classification.category,
    searchIndex,
    isActive: product.status.isActive,
    sortOrder: product.merchandising.sortOrder,
    availability: product.inventory.availability,
    quantity: product.inventory.quantity,
    hasOptions: product.hasOptions ?? false,
    ...translation,
    price: pricing.price,
    currency: pricing.currency,
    oldPrice: pricing.oldPrice,
  };
};

const getOptionPriceDelta = (
  options: ProductOption[] | undefined,
  value: string | undefined,
  country: CountryCode,
) => {
  if (!value) {
    return 0;
  }

  return (
    options?.find((option) => option.value === value)?.priceDelta?.[country] ??
    0
  );
};

export const resolveOptionPrice = (
  basePrice: number,
  options: ProductOptionGroups,
  selections: CartSelections | undefined,
  country: CountryCode,
) => {
  if (!selections) {
    return basePrice;
  }

  const delta =
    getOptionPriceDelta(options.languages, selections.language, country) +
    getOptionPriceDelta(options.formats, selections.format, country) +
    getOptionPriceDelta(options.sizes, selections.size, country) +
    getOptionPriceDelta(options.colors, selections.color, country);

  return Math.max(0, Math.round((basePrice + delta) * 100) / 100);
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
  const translation =
    detailsDocument.translations[locale] ??
    detailsDocument.translations[defaultLocale];

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
    storyProductId: detailsDocument.storyProductId,
    sku: detailsDocument.sku,
    description: translation.description,
    images: translation.images,
    languages: translation.languages,
    formats: translation.formats,
    sizes: translation.sizes,
    colors: translation.colors,
    specs: translation.specs,
    delivery: localizeDeliveryCopy(translation.delivery, locale, country),
    reviews: translation.reviews,
    digitalAssets: translation.digitalAssets,
    relatedIds: detailsDocument.relatedProductIds,
  };
};
