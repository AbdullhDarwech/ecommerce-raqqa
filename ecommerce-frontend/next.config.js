
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF هو الأسرع حالياً
    minimumCacheTTL: 31536000, // تخزين الصور في المتصفح لمدة سنة
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
    deviceSizes: [320, 420, 768, 1024, 1200], // أحجام مخصصة للشاشات العربية
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // experimental: {
  //   appDir: true,
  // },
  // ضغط الملفات النصية أيضاً لتسريع التحميل الكلي
  compress: true,
};

module.exports = nextConfig;

