import { SCHEMA_AVAILABILITY } from "@/constants/seo";
import type { Locale } from "@/i18n/config";
import type { ProductDetails } from "@/types/product-details";
import { getLocalizedProductPath, normalizeOrigin } from "@/utils";

const toAbsoluteUrl = (origin: string, url: string) =>
  url.startsWith("http")
    ? url
    : `${origin}${url.startsWith("/") ? "" : "/"}${url}`;

const createAggregateRating = (reviews: ProductDetails["reviews"]) => {
  if (!reviews.length) {
    return undefined;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);

  return {
    "@type": "AggregateRating",
    ratingValue: Number((total / reviews.length).toFixed(1)),
    reviewCount: reviews.length,
  };
};

export const createProductStructuredData = (
  product: ProductDetails,
  locale: Locale,
  origin: string,
) => {
  const base = normalizeOrigin(origin);
  const url = `${base}${getLocalizedProductPath(locale, product.slug)}`;
  const images = product.images
    .map((image) => image.src)
    .filter((src): src is string => Boolean(src))
    .map((src) => toAbsoluteUrl(base, src));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: product.sku,
    image: images.length ? images : undefined,
    aggregateRating: createAggregateRating(product.reviews),
    offers: {
      "@type": "Offer",
      url,
      price: product.price,
      priceCurrency: product.currency,
      availability: SCHEMA_AVAILABILITY[product.availability],
      itemCondition: "https://schema.org/NewCondition",
    },
  };
};
