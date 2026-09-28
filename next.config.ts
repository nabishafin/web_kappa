import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: { root: path.resolve(__dirname) },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  async redirects() {
    return [
      { source: "/settings/subscription", destination: "/pricing", permanent: false },
      { source: "/register", destination: "/signup", permanent: true },
    ];
  },
};

export default nextConfig;
