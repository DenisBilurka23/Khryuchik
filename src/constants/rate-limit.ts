export const clientIpHeaderNames = [
  "x-nf-client-connection-ip",
  "cf-connecting-ip",
  "x-real-ip",
  "x-forwarded-for",
] as const;

export const SHIPPING_QUOTE_RATE_LIMIT = {
  limit: 20,
  windowMs: 60_000,
} as const;

export const ENTERTAINMENT_VIEW_RATE_LIMIT = {
  limit: 30,
  windowMs: 60_000,
} as const;

export const AUTH_RATE_LIMIT = {
  limit: 10,
  windowMs: 60 * 60_000,
} as const;

export const CONTACT_RATE_LIMIT = {
  limit: 5,
  windowMs: 60 * 60_000,
} as const;
