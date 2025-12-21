import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile photos
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // Google CDN
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com', // Facebook photos
      },
      {
        protocol: 'https',
        hostname: 'graph.facebook.com', // Facebook Graph API
      },
    ],
  },
};

export default nextConfig;
