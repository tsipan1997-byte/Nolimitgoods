/** @type {import('next').NextConfig} */
const nextConfig = {
  // Час збирання: за ним ховаємо аукціони й лоти, торги яких уже завершились (lib/auction-lots.ts)
  env: { BUILD_TS: String(Date.now()) },
  // Головний домен — nolimitgoods.com. Старий .co.uk постійно (308) перекидає на .com з тим самим шляхом.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(www\\.)?nolimitgoods\\.co\\.uk' }],
        destination: 'https://www.nolimitgoods.com/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    const longCache = [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }];
    return [
      { source: '/ads/:file*', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }, ...longCache] },
      { source: '/parts/:file*', headers: longCache },
      { source: '/images/:file*', headers: longCache },
      { source: '/illustrations/:file*', headers: longCache },
      { source: '/testimonial-video-1.mp4', headers: longCache },
      { source: '/testimonial-video-2.mp4', headers: longCache },
      { source: '/og-image.png', headers: longCache },
    ];
  },
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
