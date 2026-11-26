import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTenant } from '@/lib/tenant-server';

// WHITE LABEL: назва бренду в заголовку — з конфігу партнера (для NoLimitGoods — як було).
export function generateMetadata(): Metadata {
  const t = getTenant();
  return {
    title: `Каталог запчастин — ${t.brand.nameLegal}`,
    description:
      'Запчастини для агротехніки, спецтехніки, вантажівок і легкових авто з цінами у фунтах і гривнях та доставкою в Україну. Оригінал, аналог, б/у.',
    alternates: { canonical: '/catalog' },
  };
}

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return children;
}
