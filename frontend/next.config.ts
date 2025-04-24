import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'f9y2nv7uff.ufs.sh',
        pathname: '/f/**',
      },
    ],
  },
  // Explicitly set public directory
  distDir: '.next',
  publicDir: 'public',
  /* config options here */
};

export default nextConfig;
