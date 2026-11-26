import type { MetadataRoute } from 'next';
import { CATEGORIES, partSlug, MODEL_PAGES } from '@/lib/catalog';
import { allParts } from '@/lib/parts-server';
import { MACHINE_BRANDS } from '@/lib/spectehnika';
import { LANDINGS } from '@/lib/landings';
import { getTenant } from '@/lib/tenant-server';

export default function sitemap(): MetadataRoute.Sitemap {
  const t = getTenant();
  // WHITE LABEL: домен партнера; без розділу запчастин (features.parts = false) — лише аукціонний портал.
  const base = t.siteUrl;
  const now = new Date();
  if (!t.features.parts) {
    return [
      // Головна партнера веде на /aukciony
      { url: `${base}/aukciony`, lastModified: now, changeFrequency: 'daily', priority: 1 },
      { url: `${base}/rezultaty-aukcioniv`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
      ...LANDINGS.map((l) => ({ url: `${base}/${l.slug}`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 })),
      { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ];
  }
  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/catalog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/aukciony`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/rezultaty-aukcioniv`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    ...LANDINGS.map((l) => ({ url: `${base}/${l.slug}`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 })),
    { url: `${base}/spectehnika`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...MACHINE_BRANDS.map((b) => ({ url: `${base}/spectehnika/${b.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...MODEL_PAGES.map((m) => ({ url: `${base}/zapchastyny/${m.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...CATEGORIES.map((c) => ({ url: `${base}/catalog?cat=${c.id}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...allParts().map((i) => ({ url: `${base}/part/${partSlug(i)}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 })),
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
