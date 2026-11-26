import type { MetadataRoute } from 'next';
import { getTenant } from '@/lib/tenant-server';
import { absUrl } from '@/lib/tenants';

export default function robots(): MetadataRoute.Robots {
  const t = getTenant();
  // WHITE LABEL: неіндексований партнер (напр. демо) — повна заборона для всіх роботів.
  if (!t.seo.indexable) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      sitemap: absUrl(t, '/sitemap.xml'),
    };
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: absUrl(t, '/sitemap.xml'),
  };
}
