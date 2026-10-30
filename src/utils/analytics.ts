import {
  ANALYTICS_CONSENT_COUNTRIES,
  CLARITY_CONSENT_GRANTED,
  CLARITY_TAG_SRC,
  GOOGLE_ANALYTICS_COOKIE_PREFIX,
  GOOGLE_TAG_CONFIG,
  GOOGLE_TAG_CONSENT_DEFAULTS,
  GOOGLE_TAG_SRC,
} from "@/constants/analytics";
import type {
  AnalyticsCommerce,
  AnalyticsConsentStatus,
  AnalyticsPurchase,
} from "@/types/analytics";
import type { CartItem } from "@/types/cart";
import type { OrderDocument } from "@/types/order";
import type { ProductDetails } from "@/types/product-details";

import type { CountryCode, CurrencyCode } from "./country";

export const isAnalyticsConsentCountry = (country: CountryCode | null) =>
  country === null || ANALYTICS_CONSENT_COUNTRIES.includes(country);

export const isAnalyticsConsentStatus = (
  value: unknown,
): value is AnalyticsConsentStatus => value === "granted" || value === "denied";

export const isAnalyticsAllowed = (
  status: AnalyticsConsentStatus | null,
  requiresConsent: boolean,
) => status === "granted" || (status === null && !requiresConsent);

export const toProductAnalytics = (
  product: ProductDetails,
  price: number,
  quantity: number,
): AnalyticsCommerce => ({
  currency: product.currency,
  value: price * quantity,
  items: [
    {
      item_id: product.productId,
      item_name: product.title,
      price,
      quantity,
    },
  ],
});

export const toCartAnalytics = (
  items: CartItem[],
  currency: CurrencyCode,
  value: number,
): AnalyticsCommerce => ({
  currency,
  value,
  items: items.map((item) => ({
    item_id: item.productId,
    item_name: item.title,
    item_variant: item.variant,
    price: item.price,
    quantity: item.quantity,
  })),
});

export const toPurchaseAnalytics = (
  order: OrderDocument,
): AnalyticsPurchase => ({
  transaction_id: order.id,
  currency: order.currency,
  value: order.total,
  shipping: order.shipping,
  coupon: order.promoCode?.code,
  items: order.items.map((item) => ({
    item_id: item.productId,
    item_name: item.title,
    item_variant: item.variant,
    price: item.unitPrice,
    quantity: item.quantity,
  })),
});

export const getGoogleTagSrc = (measurementId: string) =>
  `${GOOGLE_TAG_SRC}?id=${encodeURIComponent(measurementId)}`;

export const buildGoogleTagSnippet = (measurementId: string) =>
  [
    "window.dataLayer = window.dataLayer || [];",
    "function gtag(){dataLayer.push(arguments);}",
    `gtag("consent", "default", ${JSON.stringify(GOOGLE_TAG_CONSENT_DEFAULTS)});`,
    'gtag("js", new Date());',
    `gtag("config", ${JSON.stringify(measurementId)}, ${JSON.stringify(GOOGLE_TAG_CONFIG)});`,
  ].join("\n");

export const getClarityTagSrc = (projectId: string) =>
  `${CLARITY_TAG_SRC}${encodeURIComponent(projectId)}`;

export const buildClaritySnippet = () =>
  [
    "window.clarity = window.clarity || function(){(window.clarity.q = window.clarity.q || []).push(arguments);};",
    `window.clarity("consentv2", ${JSON.stringify(CLARITY_CONSENT_GRANTED)});`,
  ].join("\n");

const getCookieDomains = (hostname: string) => {
  const parts = hostname.split(".");

  return parts.slice(0, -1).map((_, index) => parts.slice(index).join("."));
};

export const clearGoogleAnalyticsCookies = () => {
  const domains = getCookieDomains(window.location.hostname);

  document.cookie
    .split(";")
    .map((part) => part.trim().split("=")[0])
    .filter((name) => name.startsWith(GOOGLE_ANALYTICS_COOKIE_PREFIX))
    .forEach((name) => {
      document.cookie = `${name}=; Max-Age=0; path=/`;
      domains.forEach((domain) => {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
      });
    });
};
