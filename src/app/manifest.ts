import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'val4oss studio',
    short_name: 'val4oss-studio',
    description: 'Premium web development studio — custom showcase sites and SaaS.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#1a1a1a',
    theme_color: '#c9a84c',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      // TODO: Add PNG
      // Generate with https://realfavicongenerator.net/ and add to public folder
      // { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      // { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
