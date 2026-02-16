import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This wildcard allows all HTTPS domains
      },
    ],
  },
}

export default nextConfig
