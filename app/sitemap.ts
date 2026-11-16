import type { MetadataRoute } from 'next';
import { MODEL_PAGES, CATEGORIES } from '@/lib/catalog';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.nolimitgoods.com';
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/catalog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...CATEGORIES.map((c) => ({ url: `${base}/catalog?cat=${c.id}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...MODEL_PAGES.map((m) => ({ url: `${base}/zapchastyny/${m.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 })),
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
