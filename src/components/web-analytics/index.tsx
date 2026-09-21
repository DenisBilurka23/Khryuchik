export const WebAnalytics = () => {
  const token = process.env.CLOUDFLARE_ANALYTICS_TOKEN;

  if (!token) {
    return null;
  }

  return (
    <script
      type="module"
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
};
