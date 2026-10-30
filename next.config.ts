import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Keep old links and printed QR codes working.
  async redirects() {
    return [
      { source: "/qrcode", destination: "/", permanent: true },
      { source: "/services", destination: "/", permanent: true },
      { source: "/contact", destination: "/quote", permanent: true },
      { source: "/loan", destination: "/quote", permanent: true },
      { source: "/loan-products", destination: "/conventus", permanent: true },
    ];
  },
  // PostHog analytics are sent through this site so ad blockers don't drop them (see instrumentation-client.ts).
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
