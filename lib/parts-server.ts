// Тільки для сервера (збірка сторінок і sitemap): читаємо повний каталог з диска.
import fs from 'fs';
import path from 'path';
import { CATALOG, partSlug, type CatalogItem } from './catalog';

let cache: CatalogItem[] | null = null;

export function allParts(): CatalogItem[] {
  if (cache) return cache;
  let extra: CatalogItem[] = [];
  try {
    extra = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/data/catalog-kramp.json'), 'utf8'));
  } catch {
    extra = [];
  }
  const seen = new Set<string>();
  const out: CatalogItem[] = [];
  for (const i of [...CATALOG, ...extra]) {
    const s = partSlug(i);
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(i);
  }
  cache = out;
  return out;
}

export function findPart(slug: string): CatalogItem | undefined {
  return allParts().find((i) => partSlug(i) === slug);
}

// Схожі позиції: той самий бренд і група, потім та сама група й категорія
export function relatedParts(item: CatalogItem, n = 8): CatalogItem[] {
  const all = allParts().filter((i) => i.id !== item.id);
  const a = all.filter((i) => i.brand === item.brand && i.group === item.group);
  const b = all.filter((i) => i.brand !== item.brand && i.group === item.group && i.category === item.category);
  return [...a, ...b].slice(0, n);
}
