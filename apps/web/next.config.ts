import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Memory optimizations (Next.js 15+)
  experimental: {
    webpackMemoryOptimizations: true,
  },

  // Disable source maps in production (saves memory)
  productionBrowserSourceMaps: false,

  // Reduce build output
  compress: true,

  // Note: swcMinify is default in Next.js 15+, no need to specify
  // Note: Telemetry disabled via NEXT_TELEMETRY_DISABLED=1 env variable

  // Image configuration for external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
