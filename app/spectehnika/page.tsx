import type { Metadata } from 'next';
import SpecView from './view';

const TITLE = 'Запчастини для спецтехніки і сільгосптехніки з Англії та Європи — оригінал, аналог, б/у | NoLimitGoods';
const DESCRIPTION =
  'Запчастини JCB, CAT, Manitou, Komatsu, Volvo, John Deere, Case, New Holland, Claas, Perkins, Dana/Spicer. Понад 3 млн позицій на складах Великої Британії та ЄС: оригінал, аналог, б/у з розбірок. Доставка в Україну 5–14 днів.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'запчастини для спецтехніки',
    'запчастини спецтехніка з Англії',
    'запчастини JCB',
    'запчастини Manitou',
    'запчастини Caterpillar',
    'запчастини для сільгосптехніки',
    'б/у запчастини спецтехніка розбірка',
    'запчастини для телескопічного навантажувача',
  ],
  alternates: { canonical: '/spectehnika' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://www.nolimitgoods.com/spectehnika', type: 'website', locale: 'uk_UA', siteName: 'NoLimitGoods Ltd' },
};

export default function Page() {
  return <SpecView />;
}
