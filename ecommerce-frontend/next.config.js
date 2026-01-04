
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
    deviceSizes: [320, 420, 768, 1024, 1200], // تقليل الأحجام لتوفير الباندويث
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // experimental: {
  //   appDir: true,
  // },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: false, // تعطيل لتقليل عبء المعالجة في التطوير والإنتاج
  eslint: {
    // يتجاهل أخطاء ESLint أيضاً
    ignoreDuringBuilds: true,
  },
   typescript: {
    // !! تحذير: يتجاوز فحص الأنواع أثناء البناء
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
