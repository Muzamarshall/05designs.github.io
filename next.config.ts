import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for @cloudflare/next-on-pages
  // Uncomment when deploying to Cloudflare Pages:
  // experimental: { runtime: "edge" },

  webpack: (config) => {
    // Needed for some PDF/canvas dependencies
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
