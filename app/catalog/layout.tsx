import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Каталог запчастин — NoLimitGoods Ltd',
  description:
    'Запчастини для агротехніки, спецтехніки, вантажівок і легкових авто з цінами у фунтах і гривнях та доставкою в Україну. Оригінал, аналог, б/у.',
  alternates: { canonical: '/catalog' },
};

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return children;
}
