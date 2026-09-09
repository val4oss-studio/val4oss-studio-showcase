import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  // Enable static optimization for better SEO
  output: 'standalone',

  // Les documents légaux sont des pages `.mdx` (voir src/app/[locale]/legal)
  pageExtensions: ['ts', 'tsx', 'mdx'],
  
  // Image optimization for better performance (important for SEO)
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // remotePatterns: [
    //   { protocol: 'https', hostname: '*.cdninstagram.com' },
    // ],
  },

  // Compression for better performance
  compress: true,

  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)'
          },
        ],
      },
    ];
  },
};

/*
 * Turbopack ne peut pas recevoir de fonctions JS (le bundler est en Rust) :
 * les plugins remark/rehype se déclarent par leur nom, pas par un import.
 * remark-gfm active les tableaux markdown, utilisés par les documents légaux.
 */
const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
  },
});

export default withMDX(nextConfig);
