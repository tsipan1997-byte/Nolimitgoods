// ============================================================================
// ПРИКЛАДИ ЦІН НА САЙТІ (блок «Приклади цін»)
//
// supplierPrice — реальна ціна постачальника на дату перевірки, у його валюті.
// supplierIncVat — true, якщо ціна постачальника з британським VAT 20%:
//   тоді VAT знімається, і націнка рахується від чистої ціни.
// Ціна для клієнта = чиста ціна × MARKUP (lib/site-config.ts), переведена у фунти
// за курсом НБУ. Під нею — ціна в гривнях за курсом НБУ на сьогодні.
//
// Посилання на постачальника (sourceUrl) клієнтам НЕ показується —
// воно тут лише для вас, щоб перевіряти й оновлювати ціни.
// Ціни перевірено: 16.11.2026.
// ============================================================================

export type PartType = 'original' | 'analog' | 'used';
export type Currency = 'GBP' | 'USD' | 'EUR';

export interface ShowcaseItem {
  id: string;
  brand: string;
  partNumber: string;
  titleUk: string;
  titleEn: string;
  fitsUk: string;
  fitsEn: string;
  type: PartType;
  image: string;
  imageIllustrative?: boolean; // фото того ж типу деталі, але не саме цей артикул
  supplierPrice: number;
  currency: Currency;
  supplierIncVat: boolean;
  sourceUrl: string;
  checkedAt: string;
}

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'donaldson-p558000',
    brand: 'Donaldson',
    partNumber: 'P558000',
    titleUk: 'Паливний фільтр-сепаратор, Twist&Drain',
    titleEn: 'Fuel filter / water separator, Twist&Drain',
    fitsUk: 'Cummins 3308638 та аналоги',
    fitsEn: 'Cummins 3308638 and equivalents',
    type: 'original',
    image: '/parts/Donaldson.jpeg',
    supplierPrice: 17.64,
    currency: 'GBP',
    supplierIncVat: true,
    sourceUrl:
      'https://ricoeurope.com/gb/donaldson-engine-and-vehicle-fuel-filters/47901-donaldson-p558000-fuel-filter-water-separator-spin-on-twistdrain.html',
    checkedAt: '2026-11-16',
  },
  {
    id: 'fleetguard-fs1280',
    brand: 'Fleetguard',
    partNumber: 'FS1280',
    titleUk: 'Паливний фільтр-сепаратор',
    titleEn: 'Fuel / water separator',
    fitsUk: 'Cummins 3930942',
    fitsEn: 'Cummins 3930942',
    type: 'original',
    image: '/parts/Fleetguard.jpeg',
    supplierPrice: 15.5,
    currency: 'USD',
    supplierIncVat: false,
    sourceUrl: 'https://bigrigworld.com/separator-fuel-water-fs1280.html',
    checkedAt: '2026-11-16',
  },
  {
    id: 'mann-hu7008z',
    brand: 'MANN-FILTER',
    partNumber: 'HU 7008 z',
    titleUk: 'Масляний фільтр (картридж)',
    titleEn: 'Oil filter element',
    fitsUk: 'Легкові авто — підберемо за VIN',
    fitsEn: 'Passenger cars — matched by VIN',
    type: 'original',
    image: '/parts/Mann-Filter.jpeg',
    supplierPrice: 7.1,
    currency: 'GBP',
    supplierIncVat: false,
    sourceUrl: 'https://filterfinder.co.uk/products/hu-7008-z',
    checkedAt: '2026-11-16',
  },
  {
    id: 'cat-280-7548',
    brand: 'Caterpillar',
    partNumber: '280-7548',
    titleUk: 'Замок дверей кабіни',
    titleEn: 'Cab door lock assembly',
    fitsUk: 'Кабіни техніки Caterpillar',
    fitsEn: 'Caterpillar machine cabs',
    type: 'original',
    image: '/parts/cat-door-lock.jpg',
    imageIllustrative: true,
    supplierPrice: 158.96,
    currency: 'USD',
    supplierIncVat: false,
    sourceUrl: 'https://bigrigworld.com/cabin-door-lock-280-7548.html',
    checkedAt: '2026-11-16',
  },
  {
    id: 'jcb-332-f9030',
    brand: 'JCB',
    partNumber: '332/F9030',
    titleUk: 'Гідронасос основний 36/29 cc',
    titleEn: 'Main hydraulic pump 36/29 cc',
    fitsUk: 'Екскаватори-навантажувачі JCB',
    fitsEn: 'JCB backhoe loaders',
    type: 'original',
    image: '/parts/JCB-PArker.jpg',
    imageIllustrative: true,
    supplierPrice: 831.89,
    currency: 'USD',
    supplierIncVat: false,
    sourceUrl: 'https://www.ebay.de/itm/187412407211',
    checkedAt: '2026-11-16',
  },
  {
    id: 'case-47773024',
    brand: 'Case IH / Sanden',
    partNumber: '47773024',
    titleUk: 'Компресор кондиціонера',
    titleEn: 'A/C compressor',
    fitsUk: 'Трактори, комбайни, техніка Case',
    fitsEn: 'Case tractors, combines, construction',
    type: 'original',
    image: '/parts/sanden-compressor.jpg',
    imageIllustrative: true,
    supplierPrice: 513.55,
    currency: 'USD',
    supplierIncVat: false,
    sourceUrl: 'https://parts.southeasternequip.com/products/47773024-oem-compressor-air-cond-case-construction',
    checkedAt: '2026-11-16',
  },
  {
    id: 'perkins-2645597-set',
    brand: 'Perkins',
    partNumber: '2645597',
    titleUk: 'Форсунки паливні, комплект 4 шт.',
    titleEn: 'Fuel injectors, set of 4',
    fitsUk: 'Двигуни Perkins 4.236',
    fitsEn: 'Perkins 4.236 engines',
    type: 'analog',
    image: '/parts/Perkins.jpg',
    supplierPrice: 110.19,
    currency: 'GBP',
    supplierIncVat: true,
    sourceUrl: 'https://uk.fridayparts.com/4-pieces-fuel-injector-2645597-5281608-for-perkins-engine-4-236',
    checkedAt: '2026-11-16',
  },
];
