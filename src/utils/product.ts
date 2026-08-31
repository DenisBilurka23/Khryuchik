import { BASE_CURRENCY } from "@/constants/country-currency";
import { defaultLocale, type Locale } from "@/i18n/config";
import type {
  LocalizedProductSummary,
  ProductAvailability,
  PrintifyVariantLink,
  ProductCurrencyPricing,
  ProductDetailDocument,
  ProductDocument,
  ProductPrintedStock,
} from "@/types/catalog";
import type { CartSelections } from "@/types/cart";
import type { RegionPricing } from "@/types/localization";
import type {
  ProductDetails,
  ProductOption,
  ProductOptionGroups,
} from "@/types/product-details";

import type { CountryCode, CurrencyCode } from "./country";
import { convertFromUsd } from "./price-conversion";
import { toPrintedLanguages } from "./printed-stock";
import {
  buildProductVariantMatrix,
  filterOfferedVariantOptions,
} from "./variant-matrix";

const nativePricing: RegionPricing = {
  status: "native",
  currency: BASE_CURRENCY,
};

export const isPurchasableAvailability = (availability: ProductAvailability) =>
  availability !== "out_of_stock";

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

const resolveCurrencyPricing = (
  product: ProductDocument,
  regionPricing: RegionPricing,
): ProductCurrencyPricing | null => {
  const stored = product.pricing[regionPricing.currency];

  if (stored) {
    return stored;
  }

  if (regionPricing.status !== "converted") {
    return null;
  }

  const { rate } = regionPricing.conversion;
  const source = product.pricing[BASE_CURRENCY];

  if (!source) {
    return null;
  }

  return {
    price: convertFromUsd(source.price, rate),
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
  const pricing = resolveCurrencyPricing(product, regionPricing);

  if (!translation || !pricing) {
    return null;
  }

  const searchIndex = Object.values(product.translations)
    .flatMap((localizedTranslation) => [
      localizedTranslation.title,
      localizedTranslation.subtitle,
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
    ageRating: product.ageRating,
    series: product.series,
    isActive: product.status.isActive,
    sortOrder: product.merchandising.sortOrder,
    availability: product.inventory.availability,
    quantity: product.inventory.quantity,
    hasOptions: product.hasOptions ?? false,
    ...translation,
    price: pricing.price,
    currency: regionPricing.currency,
    oldPrice: pricing.oldPrice,
  };
};

const localizeOptionPrices = (
  options: ProductOption[] | undefined,
  regionPricing: RegionPricing,
): ProductOption[] | undefined => {
  if (!options || regionPricing.status !== "converted") {
    return options;
  }

  const { currency, rate } = regionPricing.conversion;

  return options.map((option) => {
    const sourceDelta = option.priceDelta?.[BASE_CURRENCY];

    if (
      option.priceDelta?.[currency] !== undefined ||
      sourceDelta === undefined
    ) {
      return option;
    }

    return {
      ...option,
      priceDelta: {
        ...option.priceDelta,
        [currency]: convertFromUsd(sourceDelta, rate),
      },
    };
  });
};

export const localizeProductOptionGroups = (
  options: ProductOptionGroups,
  regionPricing: RegionPricing = nativePricing,
): ProductOptionGroups => ({
  languages: localizeOptionPrices(options.languages, regionPricing),
  formats: localizeOptionPrices(options.formats, regionPricing),
  sizes: localizeOptionPrices(options.sizes, regionPricing),
  colors: localizeOptionPrices(options.colors, regionPricing),
});

const getOptionPriceDelta = (
  options: ProductOption[] | undefined,
  value: string | undefined,
  currency: CurrencyCode,
) => {
  if (!value) {
    return 0;
  }

  return (
    options?.find((option) => option.value === value)?.priceDelta?.[currency] ??
    0
  );
};

export const resolveOptionPrice = (
  basePrice: number,
  options: ProductOptionGroups,
  selections: CartSelections | undefined,
  currency: CurrencyCode,
) => {
  if (!selections) {
    return basePrice;
  }

  const delta =
    getOptionPriceDelta(options.languages, selections.language, currency) +
    getOptionPriceDelta(options.formats, selections.format, currency) +
    getOptionPriceDelta(options.sizes, selections.size, currency) +
    getOptionPriceDelta(options.colors, selections.color, currency);

  return Math.max(0, Math.round((basePrice + delta) * 100) / 100);
};

export const isLocalizedProductSummary = (
  product: LocalizedProductSummary | null,
): product is LocalizedProductSummary => product !== null;

export const toProductDetails = (
  summary: LocalizedProductSummary,
  detailsDocument: ProductDetailDocument,
  printifyVariants: PrintifyVariantLink[] | undefined,
  locale: Locale,
  country: CountryCode,
  regionPricing: RegionPricing = nativePricing,
  printedStock?: ProductPrintedStock,
): ProductDetails | null => {
  const translation =
    detailsDocument.translations[locale] ??
    detailsDocument.translations[defaultLocale];

  if (!translation) {
    return null;
  }

  const options = localizeProductOptionGroups(translation, regionPricing);
  const variantMatrix = buildProductVariantMatrix(printifyVariants);
  const offered = filterOfferedVariantOptions(variantMatrix, options);

  return {
    productId: summary.id,
    slug: summary.slug,
    title: summary.title,
    subtitle: summary.subtitle,
    price: summary.price,
    currency: summary.currency,
    oldPrice: summary.oldPrice,
    availability: summary.availability,
    series: summary.series,
    storyLabel: translation.storyLabel,
    storyTitle: translation.storyTitle,
    storyProductId: detailsDocument.storyProductId,
    sku: detailsDocument.sku,
    description: translation.description,
    images: translation.images,
    languages: options.languages,
    formats: options.formats,
    sizes: offered.sizes,
    colors: offered.colors,
    variantMatrix,
    printedLanguages: toPrintedLanguages(printedStock),
    specs: translation.specs,
    delivery: localizeDeliveryCopy(translation.delivery, locale, country),
    reviews: translation.reviews,
    digitalAssets: translation.digitalAssets,
    relatedIds: detailsDocument.relatedProductIds,
  };
};
