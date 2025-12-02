/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['example.com', 'res.cloudinary.com'], // للصور من Cloudinary
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
