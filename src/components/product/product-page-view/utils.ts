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

const toGtin13 = (isbn: string) => {
  const digits = isbn.replace(/[^0-9]/g, "");

  return digits.length === 13 ? digits : undefined;
};

type ProductStructuredDataInput = {
  product: ProductDetails;
  locale: Locale;
  origin: string;
  brand: string;
  isAvailableInRegion: boolean;
};

export const createProductStructuredData = ({
  product,
  locale,
  origin,
  brand,
  isAvailableInRegion,
}: ProductStructuredDataInput) => {
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
    brand: { "@type": "Brand", name: brand },
    sku: product.sku,
    mpn: product.sku,
    isbn: product.isbn,
    gtin13: product.isbn ? toGtin13(product.isbn) : undefined,
    image: images.length ? images : undefined,
    aggregateRating: createAggregateRating(product.reviews),
    offers: isAvailableInRegion
      ? {
          "@type": "Offer",
          url,
          price: product.price,
          priceCurrency: product.currency,
          availability: SCHEMA_AVAILABILITY[product.availability],
          itemCondition: "https://schema.org/NewCondition",
        }
      : undefined,
  };
};
