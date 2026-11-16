import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Техніка з аукціонів Великої Британії — NoLimitGoods Ltd',
  description:
    'Викуповуємо для вас лоти з британських аукціонів спецтехніки: екскаватори, телескопічні навантажувачі, генератори, гідромолоти, грейфери. Ставка за вашим лімітом, експорт і доставка в Україну.',
  alternates: { canonical: '/aukciony' },
};

export default function AuctionsLayout({ children }: { children: ReactNode }) {
  return children;
}
