import type { Metadata } from 'next';
import SpecView from './view';
import { getTenant } from '@/lib/tenant-server';
import { absUrl } from '@/lib/tenants';

const TITLE_BASE = 'Запчастини для спецтехніки і сільгосптехніки з Англії та Європи — оригінал, аналог, б/у';
const DESCRIPTION =
  'Запчастини JCB, CAT, Manitou, Komatsu, Volvo, John Deere, Case, New Holland, Claas, Perkins, Dana/Spicer. Понад 3 млн позицій на складах Великої Британії та ЄС: оригінал, аналог, б/у з розбірок. Доставка в Україну 5–14 днів.';

// WHITE LABEL: бренд і домен — з конфігу партнера (для NoLimitGoods — як було).
export function generateMetadata(): Metadata {
  const t = getTenant();
  const TITLE = `${TITLE_BASE} | ${t.brand.name}`;
  return {
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
    openGraph: { title: TITLE, description: DESCRIPTION, url: absUrl(t, '/spectehnika'), type: 'website', locale: 'uk_UA', siteName: t.brand.nameLegal },
  };
}

export default function Page() {
  return <SpecView />;
}
