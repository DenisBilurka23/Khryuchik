import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const R2_PUBLIC_BASE_URL_DEV_FALLBACK = "https://cdn.khryuchik.com";

const resolveR2PublicBaseUrl = () => {
  const configured = process.env.R2_PUBLIC_BASE_URL?.trim();

  if (configured) {
    return configured.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "R2_PUBLIC_BASE_URL is required to allow storefront images through the image optimizer",
    );
  }

  return R2_PUBLIC_BASE_URL_DEV_FALLBACK;
};

const r2PublicBaseUrl = resolveR2PublicBaseUrl();

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
