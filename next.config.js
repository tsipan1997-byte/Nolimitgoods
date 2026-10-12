/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Дозволяє завантаження картинок з будь-яких зовнішніх каталогів
      },
    ],
  },
};

export default nextConfig;
