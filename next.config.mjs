/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // Meta / Facebook CDN (thumbnails, creatives)
      { protocol: 'https', hostname: '**.fbcdn.net' },
      { protocol: 'https', hostname: '**.facebook.com' },
      { protocol: 'https', hostname: 'lookaside.fbsbx.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
};

export default nextConfig;
