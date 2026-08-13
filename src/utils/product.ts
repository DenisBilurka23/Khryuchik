import { defaultLocale, type Locale } from "@/i18n/config";
import type {
  LocalizedProductSummary,
  ProductCountryPricing,
  ProductDetailDocument,
  ProductDocument,
} from "@/types/catalog";
import type { CartSelections } from "@/types/cart";
import type { RegionPricing } from "@/types/localization";
import type {
  ProductDetails,
  ProductOption,
  ProductOptionGroups,
} from "@/types/product-details";

import type { CountryCode } from "./country";
import { convertFromUsd } from "./price-conversion";

const nativePricing: RegionPricing = { status: "native" };

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

const resolveCountryPricing = (
  product: ProductDocument,
  country: CountryCode,
  regionPricing: RegionPricing,
): ProductCountryPricing | null => {
  const stored = product.pricing[country];

  if (stored) {
    return stored;
  }

  if (regionPricing.status !== "converted") {
    return null;
  }

  const { currency, rate, sourceCountry } = regionPricing.conversion;
  const source = product.pricing[sourceCountry];

  if (!source) {
    return null;
  }

  return {
    price: convertFromUsd(source.price, rate),
    currency,
    ...(source.oldPrice === undefined
      ? {}
      : { oldPrice: convertFromUsd(source.oldPrice, rate) }),
  };
};

export const localizeProductSummary = (
  product: ProductDocument,
  locale: Locale,
  country: CountryCode,
  regionPricing: RegionPricing = nativePricing,
): LocalizedProductSummary | null => {
  if (!product.availableRegions?.includes(country)) {
    return null;
  }
  const translation =
    product.translations[locale] ?? product.translations[defaultLocale];
  const pricing = resolveCountryPricing(product, country, regionPricing);

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

// Deltas are converted one by one and each rounded up on its own, so a
// converted option can land up to one currency unit above the exact conversion
// of base + delta. That is always in the shop's favour and invisible at the
// scale of a single unit, which beats threading the source price through every
// caller just to round the sum once.
const localizeOptionPrices = (
  options: ProductOption[] | undefined,
  country: CountryCode,
  regionPricing: RegionPricing,
): ProductOption[] | undefined => {
  if (!options || regionPricing.status !== "converted") {
    return options;
  }

  const { rate, sourceCountry } = regionPricing.conversion;

  return options.map((option) => {
    const sourceDelta = option.priceDelta?.[sourceCountry];

    if (
      option.priceDelta?.[country] !== undefined ||
      sourceDelta === undefined
    ) {
      return option;
    }

    return {
      ...option,
      priceDelta: {
        ...option.priceDelta,
        [country]: convertFromUsd(sourceDelta, rate),
      },
    };
  });
};

export const localizeProductOptionGroups = (
  options: ProductOptionGroups,
  country: CountryCode,
  regionPricing: RegionPricing = nativePricing,
): ProductOptionGroups => ({
  languages: localizeOptionPrices(options.languages, country, regionPricing),
  formats: localizeOptionPrices(options.formats, country, regionPricing),
  sizes: localizeOptionPrices(options.sizes, country, regionPricing),
  colors: localizeOptionPrices(options.colors, country, regionPricing),
});

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
  regionPricing: RegionPricing = nativePricing,
): ProductDetails | null => {
  const translation =
    detailsDocument.translations[locale] ??
    detailsDocument.translations[defaultLocale];

  if (!translation) {
    return null;
  }

  // Options carry their deltas to the client, where the price picker adds them
  // to the base price, so they have to arrive already in the region's currency.
  const options = localizeProductOptionGroups(
    translation,
    country,
    regionPricing,
  );

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
    languages: options.languages,
    formats: options.formats,
    sizes: options.sizes,
    colors: options.colors,
    specs: translation.specs,
    delivery: localizeDeliveryCopy(translation.delivery, locale, country),
    reviews: translation.reviews,
    digitalAssets: translation.digitalAssets,
    relatedIds: detailsDocument.relatedProductIds,
  };
};
