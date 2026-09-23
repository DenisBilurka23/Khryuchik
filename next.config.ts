import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const R2_PUBLIC_BASE_URL_FALLBACK = "https://cdn.khryuchik.com";

const r2PublicBaseUrl = (
  process.env.R2_PUBLIC_BASE_URL || R2_PUBLIC_BASE_URL_FALLBACK
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  images: {
    remotePatterns: [new URL(`${r2PublicBaseUrl}/**`)],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
  },
};

export default withNextIntl(nextConfig);
