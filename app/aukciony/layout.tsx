import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const TITLE = 'Аукціони спецтехніки Великої Британії — купити екскаватор, JCB, трактор з аукціону | NoLimitGoods';
const DESCRIPTION =
  'Купуємо спецтехніку на аукціонах Англії під ваше замовлення: екскаватори, JCB 3CX, телескопічні навантажувачі, трактори John Deere і New Holland, генератори, гідромолоти. Euro Auctions, Cheffins, Wilsons, Brightwells. Комісія 1,99–2,99%, огляд перед ставкою, експорт і доставка в Україну.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'аукціони спецтехніки',
    'аукціон спецтехніки Англія',
    'аукціон техніки Великобританія',
    'купити спецтехніку з аукціону',
    'спецтехніка з Англії',
    'спецтехніка з Європи під замовлення',
    'Euro Auctions Україна',
    'купити екскаватор з аукціону',
    'JCB 3CX з Англії',
    'телескопічний навантажувач JCB купити',
    'трактор з Англії',
    'генератор з Англії',
    'гідромолот купити',
    'пригон спецтехніки',
    'аукцион спецтехники Англия',
  ],
  alternates: { canonical: '/aukciony' },
  openGraph: {
    title: 'Спецтехніка з аукціонів Англії — під ваше замовлення',
    description: DESCRIPTION,
    url: 'https://www.nolimitgoods.com/aukciony',
    type: 'website',
    locale: 'uk_UA',
    siteName: 'NoLimitGoods Ltd',
    images: [{ url: '/ads/og_aukciony_nlg.jpg', width: 1200, height: 630, alt: 'Аукціони спецтехніки Великої Британії — NoLimitGoods' }],
  },
};

export default function AuctionsLayout({ children }: { children: ReactNode }) {
  return children;
}
