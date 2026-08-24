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
