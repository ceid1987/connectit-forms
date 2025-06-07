import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add Image optimization config
  images: {
    unoptimized: false,
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
