/** @type {import('next').NextConfig} */
const nextConfig = {
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
    return [{ source: '/ads/:file*', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }] }];
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
