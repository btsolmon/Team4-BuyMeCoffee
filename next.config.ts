import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.vercel-storage.com", // vercel blob-д
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
