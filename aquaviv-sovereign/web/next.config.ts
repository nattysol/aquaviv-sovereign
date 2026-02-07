import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // Allow Sanity Images
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com', // Allow Shopify Images
      }
    ],
  },
};

export default nextConfig;