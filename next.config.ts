import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // Tiptap yjs fix: @see https://tiptap.dev/docs/editor/getting-started/install/nextjs
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias['yjs'] = path.resolve(__dirname, 'node_modules/yjs')
    }

    return config
  },
  images: {
    remotePatterns: [
      // Allow loading images from any domain
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
