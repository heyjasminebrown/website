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
      { source: "/contact", destination: "/loan", permanent: true },
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
