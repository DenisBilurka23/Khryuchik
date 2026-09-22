import Script from "next/script";

export const WebAnalytics = () => {
  const token = process.env.CLOUDFLARE_ANALYTICS_TOKEN;

  if (!token || process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
};
