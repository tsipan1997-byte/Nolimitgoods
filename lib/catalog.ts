// ============================================================================
// КАТАЛОГ ДЕТАЛЕЙ (сторінка /catalog і блок «Приклади цін» на головній)
//
// supplierPrice — ціна постачальника на дату перевірки, у його валюті.
// supplierIncVat — true, якщо в ціні вже є британський VAT 20% (тоді він знімається).
//   Якщо постачальник не вказує, чи є VAT, ставимо false: так наша ціна точно не занижена.
// Ціна для клієнта = чиста ціна × MARKUP (lib/site-config.ts) + доставка за вагою (lib/pricing.ts).
// weightKg — орієнтовна вага для розрахунку доставки.
// featured — показувати в блоці «Приклади цін» на головній.
// sourceUrl клієнтам НЕ показується: лише для вас, щоб перевіряти й оновлювати ціни.
// Ціни перевірено: 16.11.2026.
// ============================================================================

import type { Currency } from './pricing';

export type CategoryId = 'agro' | 'construction' | 'trucks' | 'cars';
export type GroupId = 'filters' | 'engine' | 'hydraulics' | 'electrics' | 'chassis' | 'cab' | 'climate' | 'wear';
export type PartType = 'original' | 'analog' | 'new' | 'used';

export const CATEGORIES: { id: CategoryId; uk: string; en: string; hintUk: string; hintEn: string; image: string }[] = [
  { id: 'agro', uk: 'Агро і трактори', en: 'Farm & tractors', hintUk: 'Case IH, New Holland, John Deere, MF, Claas', hintEn: 'Case IH, New Holland, John Deere, MF, Claas', image: '/parts/case_international_puma_series.png.webp' },
  { id: 'construction', uk: 'Спецтехніка', en: 'Construction', hintUk: 'JCB, CAT, Komatsu, Hyundai, Volvo CE', hintEn: 'JCB, CAT, Komatsu, Hyundai, Volvo CE', image: '/parts/JCB-PArker.jpg' },
  { id: 'trucks', uk: 'Вантажівки', en: 'Trucks', hintUk: 'DAF, MAN, Scania, Volvo, Mercedes', hintEn: 'DAF, MAN, Scania, Volvo, Mercedes', image: '/parts/Fleetguard.jpeg' },
  { id: 'cars', uk: 'Легкові авто', en: 'Cars', hintUk: 'Підбір за VIN: ТО, ходова, оптика', hintEn: 'VIN lookup: service, suspension, lights', image: '/parts/suspension.webp' },
];

export const GROUPS: { id: GroupId; uk: string; en: string }[] = [
  { id: 'filters', uk: 'Фільтри', en: 'Filters' },
  { id: 'engine', uk: 'Двигун', en: 'Engine' },
  { id: 'hydraulics', uk: 'Гідравліка і трансмісія', en: 'Hydraulics & drivetrain' },
  { id: 'electrics', uk: 'Електрика', en: 'Electrics' },
  { id: 'chassis', uk: 'Ходова і гальма', en: 'Chassis & brakes' },
  { id: 'cab', uk: 'Кабіна і кузов', en: 'Cab & body' },
  { id: 'climate', uk: 'Кондиціонування', en: 'Air conditioning' },
  { id: 'wear', uk: 'Ковші і зуби', en: 'Buckets & teeth' },
];

export const TYPE_LABEL: Record<PartType, { uk: string; en: string; cls: string }> = {
  original: { uk: 'Оригінал', en: 'Genuine', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  analog: { uk: 'Аналог', en: 'Aftermarket', cls: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  new: { uk: 'Новий', en: 'New', cls: 'bg-slate-500/20 text-slate-200 border-slate-500/40' },
  used: { uk: 'Б/у', en: 'Used', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
};

export interface CatalogItem {
  id: string;
  category: CategoryId;
  group: GroupId;
  brand: string;
  partNumber: string;
  titleUk: string;
  titleEn: string;
  fitsUk: string;
  fitsEn: string;
  type: PartType;
  image?: string;
  imageIllustrative?: boolean;
  alt?: string; // інший запис того ж номера (напр. JCB без префікса JC) — для пошуку
  supplierPrice: number;
  currency: Currency;
  supplierIncVat: boolean;
  weightKg: number;
  oversized?: boolean;
  featured?: boolean;
  sourceUrl?: string;
  checkedAt?: string;
}

const D = '2026-11-16';

export const CATALOG: CatalogItem[] = [
  // ───────────── АГРО ─────────────
  { id: 'case-47773024', category: 'agro', group: 'climate', brand: 'Case IH / Sanden', partNumber: '47773024',
    titleUk: 'Компресор кондиціонера', titleEn: 'A/C compressor',
    fitsUk: 'Трактори, комбайни, техніка Case', fitsEn: 'Case tractors, combines, construction',
    type: 'original', image: '/parts/sanden-compressor.jpg', imageIllustrative: true,
    supplierPrice: 513.55, currency: 'USD', supplierIncVat: false, weightKg: 8.2, featured: true,
    sourceUrl: 'https://parts.southeasternequip.com/products/47773024-oem-compressor-air-cond-case-construction', checkedAt: D },
  { id: 'nh-87588814', category: 'agro', group: 'hydraulics', brand: 'CNH', partNumber: '87588814',
    titleUk: 'Гідравлічний фільтр', titleEn: 'Hydraulic filter, spin-on',
    fitsUk: 'New Holland T6, T7, T7000', fitsEn: 'New Holland T6, T7, T7000',
    type: 'new', supplierPrice: 38.23, currency: 'GBP', supplierIncVat: false, weightKg: 1.5,
    sourceUrl: 'https://agrilineproducts.com/new-holland-hydraulic-filter-spin-on-cnh-original-item-87588814-80026', checkedAt: D },
  { id: 'nh-hf7569', category: 'agro', group: 'hydraulics', brand: 'Fleetguard', partNumber: 'HF7569',
    titleUk: 'Гідравлічний фільтр', titleEn: 'Hydraulic filter',
    fitsUk: 'Трактори New Holland', fitsEn: 'New Holland tractors',
    type: 'analog', supplierPrice: 15.35, currency: 'GBP', supplierIncVat: false, weightKg: 1.2,
    sourceUrl: 'https://agrilineproducts.com/new-holland-fleetguard-hf7569-hydraulic-oil-filter-hf7569', checkedAt: D },
  { id: 'mf-lf3402', category: 'agro', group: 'filters', brand: 'Fleetguard', partNumber: 'LF3402',
    titleUk: 'Масляний фільтр (MF 1447048M1)', titleEn: 'Oil filter (MF 1447048M1)',
    fitsUk: 'Massey Ferguson 200/300/3000/4200/6100 та ін.', fitsEn: 'Massey Ferguson 200/300/3000/4200/6100 etc.',
    type: 'analog', supplierPrice: 14.99, currency: 'GBP', supplierIncVat: false, weightKg: 1,
    sourceUrl: 'https://agrilineproducts.com/massey-ferguson-fleetguard-lf3402-oil-filter-lf3402', checkedAt: D },
  { id: 'perkins-26540132', category: 'agro', group: 'filters', brand: 'Perkins (аналог)', partNumber: '26540132',
    titleUk: 'Масляний фільтр', titleEn: 'Oil filter',
    fitsUk: 'Perkins A3.144, A3.152, AD3.152', fitsEn: 'Perkins A3.144, A3.152, AD3.152',
    type: 'analog', supplierPrice: 4.72, currency: 'GBP', supplierIncVat: false, weightKg: 0.5,
    sourceUrl: 'https://agrilineproducts.com/perkins-oil-filter-5119', checkedAt: D },
  { id: 'perkins-2645597-set', category: 'agro', group: 'engine', brand: 'Perkins (аналог)', partNumber: '2645597',
    titleUk: 'Форсунки паливні, комплект 4 шт.', titleEn: 'Fuel injectors, set of 4',
    fitsUk: 'Двигуни Perkins 4.236', fitsEn: 'Perkins 4.236 engines',
    type: 'analog', image: '/parts/Perkins.jpg', supplierPrice: 110.19, currency: 'GBP', supplierIncVat: true, weightKg: 1.6, featured: true,
    sourceUrl: 'https://uk.fridayparts.com/4-pieces-fuel-injector-2645597-5281608-for-perkins-engine-4-236', checkedAt: D },

  // ───────────── СПЕЦТЕХНІКА ─────────────
  { id: 'jcb-332-f9030', category: 'construction', group: 'hydraulics', brand: 'JCB', partNumber: '332/F9030',
    titleUk: 'Гідронасос основний 36/29 cc', titleEn: 'Main hydraulic pump 36/29 cc',
    fitsUk: 'Екскаватори-навантажувачі JCB', fitsEn: 'JCB backhoe loaders',
    type: 'new', image: '/parts/JCB-PArker.jpg', imageIllustrative: true,
    supplierPrice: 831.89, currency: 'USD', supplierIncVat: false, weightKg: 17, featured: true,
    sourceUrl: 'https://www.ebay.de/itm/187412407211', checkedAt: D },
  { id: 'jcb-20-925327', category: 'construction', group: 'hydraulics', brand: 'JCB', partNumber: '20/925327',
    titleUk: 'Насос коробки передач (підживлення)', titleEn: 'Transmission charge pump',
    fitsUk: 'JCB 3CX / 4CX', fitsEn: 'JCB 3CX / 4CX',
    type: 'new', supplierPrice: 144, currency: 'GBP', supplierIncVat: false, weightKg: 3,
    sourceUrl: 'https://cgrobinsonparts.co.uk/products/jcb-transmission-pump', checkedAt: D },
  { id: 'cat-280-7548', category: 'construction', group: 'cab', brand: 'Caterpillar', partNumber: '280-7548',
    titleUk: 'Замок дверей кабіни', titleEn: 'Cab door lock assembly',
    fitsUk: 'Кабіни техніки Caterpillar', fitsEn: 'Caterpillar machine cabs',
    type: 'original', image: '/parts/cat-door-lock.jpg', imageIllustrative: true,
    supplierPrice: 158.96, currency: 'USD', supplierIncVat: false, weightKg: 1.4, featured: true,
    sourceUrl: 'https://bigrigworld.com/cabin-door-lock-280-7548.html', checkedAt: D },
  { id: 'jcb-lf17556', category: 'construction', group: 'filters', brand: 'Fleetguard', partNumber: 'LF17556',
    titleUk: 'Масляний фільтр (JCB 320/B4420)', titleEn: 'Oil filter (JCB 320/B4420)',
    fitsUk: 'JCB 2CX/3CX/4CX, Loadall, 411–416', fitsEn: 'JCB 2CX/3CX/4CX, Loadall, 411–416',
    type: 'analog', supplierPrice: 20.83, currency: 'GBP', supplierIncVat: false, weightKg: 1,
    sourceUrl: 'https://agrilineproducts.com/jcb-fleetguard-lf17556-oil-filter-lf17556', checkedAt: D },
  { id: 'jcb-320-b4568', category: 'construction', group: 'engine', brand: 'JCB', partNumber: '320/B4568',
    titleUk: 'Водяна помпа', titleEn: 'Water pump',
    fitsUk: 'JCB 3CX, Loadall 531–541, 131X', fitsEn: 'JCB 3CX, Loadall 531–541, 131X',
    type: 'original', supplierPrice: 48.34, currency: 'GBP', supplierIncVat: false, weightKg: 3,
    sourceUrl: 'https://www.mitchells.co.uk/products/water-pump-genuine-jcb-parts-320-b4568/', checkedAt: D },
  { id: 'jcb-320-08610', category: 'construction', group: 'electrics', brand: 'Mahle', partNumber: '320/08610',
    titleUk: 'Генератор 14V 95A', titleEn: 'Alternator 14V 95A',
    fitsUk: 'JCB 2CX/3CX/4CX, Loadall', fitsEn: 'JCB 2CX/3CX/4CX, Loadall',
    type: 'analog', supplierPrice: 240, currency: 'GBP', supplierIncVat: false, weightKg: 6,
    sourceUrl: 'https://agrilineproducts.com/jcb-alternator-14v-95-amps-mahle-97076', checkedAt: D },
  { id: 'jcb-320-09346', category: 'construction', group: 'electrics', brand: 'JCB (аналог)', partNumber: '320/09346',
    titleUk: 'Стартер 12V', titleEn: 'Starter motor 12V',
    fitsUk: 'Двигун JCB 444', fitsEn: 'JCB 444 engine',
    type: 'analog', supplierPrice: 258.84, currency: 'USD', supplierIncVat: false, weightKg: 6,
    sourceUrl: 'https://www.fridayparts.com/jcb-starter-motor-12v-320-09346-320-09035-320-09032-320-09026-320-09022-320-09144', checkedAt: D },
  { id: 'jcb-762932-turbo', category: 'construction', group: 'engine', brand: 'JCB (аналог)', partNumber: '762932-5006',
    titleUk: 'Турбокомпресор', titleEn: 'Turbocharger',
    fitsUk: 'JCB Dieselmax 444', fitsEn: 'JCB Dieselmax 444',
    type: 'analog', supplierPrice: 383.25, currency: 'USD', supplierIncVat: false, weightKg: 8,
    sourceUrl: 'https://www.fridayparts.com/turbocharger-762932-5006-762932-0006-762932-6-for-jcb-diselmax-scout444', checkedAt: D },
  { id: 'jcb-320-02709', category: 'construction', group: 'engine', brand: 'JCB (аналог)', partNumber: '320/02709',
    titleUk: 'Прокладка ГБЦ', titleEn: 'Cylinder head gasket',
    fitsUk: 'Двигун JCB 444', fitsEn: 'JCB 444 engine',
    type: 'analog', supplierPrice: 39.11, currency: 'GBP', supplierIncVat: false, weightKg: 0.8,
    sourceUrl: 'https://uk.fridayparts.com/cylinder-head-gasket-320-02709-for-jcb-engine-444', checkedAt: D },
  { id: 'jcb-02-202480', category: 'construction', group: 'engine', brand: 'JCB (аналог)', partNumber: '02/202480',
    titleUk: 'Водяна помпа', titleEn: 'Water pump',
    fitsUk: 'JCB (02/202481, 02/202881, 332/H0896)', fitsEn: 'JCB (02/202481, 02/202881, 332/H0896)',
    type: 'analog', supplierPrice: 79.99, currency: 'GBP', supplierIncVat: false, weightKg: 3,
    sourceUrl: 'https://agrilineproducts.com/jcb-water-pump-1732', checkedAt: D },
  { id: 'donaldson-p551315', category: 'construction', group: 'filters', brand: 'Donaldson', partNumber: 'P551315',
    titleUk: 'Паливний фільтр', titleEn: 'Fuel filter, spin-on',
    fitsUk: 'Caterpillar 1R-0759', fitsEn: 'Caterpillar 1R-0759',
    type: 'original', supplierPrice: 13.49, currency: 'GBP', supplierIncVat: false, weightKg: 0.8,
    sourceUrl: 'https://ricoeurope.com/gb/donaldson-engine-and-vehicle-fuel-filters/48038-donaldson-p551315-fuel-filter-spin-on.html', checkedAt: D },

  // ───────────── ВАНТАЖІВКИ ─────────────
  { id: 'donaldson-p558000', category: 'trucks', group: 'filters', brand: 'Donaldson', partNumber: 'P558000',
    titleUk: 'Паливний фільтр-сепаратор, Twist&Drain', titleEn: 'Fuel filter / water separator, Twist&Drain',
    fitsUk: 'Cummins 3308638 та аналоги', fitsEn: 'Cummins 3308638 and equivalents',
    type: 'original', image: '/parts/Donaldson.jpeg', supplierPrice: 17.64, currency: 'GBP', supplierIncVat: true, weightKg: 1.2, featured: true,
    sourceUrl: 'https://ricoeurope.com/gb/donaldson-engine-and-vehicle-fuel-filters/47901-donaldson-p558000-fuel-filter-water-separator-spin-on-twistdrain.html', checkedAt: D },
  { id: 'fleetguard-fs1280', category: 'trucks', group: 'filters', brand: 'Fleetguard', partNumber: 'FS1280',
    titleUk: 'Паливний фільтр-сепаратор', titleEn: 'Fuel / water separator',
    fitsUk: 'Cummins 3930942', fitsEn: 'Cummins 3930942',
    type: 'original', image: '/parts/Fleetguard.jpeg', supplierPrice: 15.5, currency: 'USD', supplierIncVat: false, weightKg: 1, featured: true,
    sourceUrl: 'https://bigrigworld.com/separator-fuel-water-fs1280.html', checkedAt: D },
  { id: 'fleetguard-lf9009', category: 'trucks', group: 'filters', brand: 'Fleetguard', partNumber: 'LF9009',
    titleUk: 'Масляний фільтр комбінований', titleEn: 'Combination lube filter',
    fitsUk: 'Cummins ISL / ISC', fitsEn: 'Cummins ISL / ISC',
    type: 'original', supplierPrice: 71.9, currency: 'GBP', supplierIncVat: false, weightKg: 2,
    sourceUrl: 'https://filterfinder.co.uk/products/lf9009', checkedAt: D },
  { id: 'baldwin-pf7947', category: 'trucks', group: 'filters', brand: 'Baldwin', partNumber: 'PF7947',
    titleUk: 'Паливний фільтр (DAF 1643080)', titleEn: 'Fuel filter (DAF 1643080)',
    fitsUk: 'DAF 1616361, 1643080, 1699168', fitsEn: 'DAF 1616361, 1643080, 1699168',
    type: 'analog', supplierPrice: 26.18, currency: 'GBP', supplierIncVat: false, weightKg: 0.6,
    sourceUrl: 'https://inlinefilters.co.uk/Filters-Fuel/BrandSpecificBaldwin/Cartridge/FBW-PF7947', checkedAt: D },
  { id: 'mann-w950-26', category: 'trucks', group: 'filters', brand: 'MANN-FILTER', partNumber: 'W 950/26',
    titleUk: 'Масляний фільтр', titleEn: 'Oil filter, spin-on',
    fitsUk: 'Вантажівки та спецтехніка', fitsEn: 'Trucks and machinery',
    type: 'original', supplierPrice: 11, currency: 'GBP', supplierIncVat: false, weightKg: 1,
    sourceUrl: 'https://truckspares365.co.uk/3651064423.html', checkedAt: D },

  // ───────────── ЛЕГКОВІ ─────────────
  { id: 'mann-hu7008z', category: 'cars', group: 'filters', brand: 'MANN-FILTER', partNumber: 'HU 7008 z',
    titleUk: 'Масляний фільтр (картридж)', titleEn: 'Oil filter element',
    fitsUk: 'Легкові авто — підберемо за VIN', fitsEn: 'Passenger cars — matched by VIN',
    type: 'original', image: '/parts/Mann-Filter.jpeg', supplierPrice: 7.1, currency: 'GBP', supplierIncVat: false, weightKg: 0.3, featured: true,
    sourceUrl: 'https://filterfinder.co.uk/products/hu-7008-z', checkedAt: D },
  { id: 'ufi-23-461-00', category: 'cars', group: 'filters', brand: 'UFI', partNumber: '23.461.00',
    titleUk: 'Масляний фільтр (OE 26300-35505)', titleEn: 'Oil filter (OE 26300-35505)',
    fitsUk: 'Hyundai Tucson, i30, Santa Fe; Kia Sportage, Ceed', fitsEn: 'Hyundai Tucson, i30, Santa Fe; Kia Sportage, Ceed',
    type: 'analog', supplierPrice: 4.5, currency: 'GBP', supplierIncVat: true, weightKg: 0.4,
    sourceUrl: 'https://www.autodoc.co.uk/ufi/7241666', checkedAt: D },
  { id: 'bosch-0986494541', category: 'cars', group: 'chassis', brand: 'Bosch', partNumber: '0 986 494 541',
    titleUk: 'Гальмівні колодки, комплект', titleEn: 'Brake pad set',
    fitsUk: 'Підбір за VIN', fitsEn: 'Matched by VIN',
    type: 'analog', supplierPrice: 21.99, currency: 'GBP', supplierIncVat: true, weightKg: 1.5,
    sourceUrl: 'https://www.autodoc.co.uk/bosch/7627120', checkedAt: D },

  // ───────────── ЛЕГКОВІ: ТОП ІМПОРТОВАНИХ В УКРАЇНУ МОДЕЛЕЙ ─────────────
  { id: 'tesla-1188341-00-c', category: 'cars', group: 'chassis', brand: 'Tesla', partNumber: '1188341-00-C',
    titleUk: 'Важіль передній нижній (передній)', titleEn: 'Front lower control arm (front position)',
    fitsUk: 'Tesla Model Y 2020–2023', fitsEn: 'Tesla Model Y 2020–2023',
    type: 'new', supplierPrice: 139.95, currency: 'USD', supplierIncVat: false, weightKg: 3,
    sourceUrl: 'https://evannex.com/products/front-lower-front-position-control-arm-for-tesla-model-y', checkedAt: D },
  { id: 'tesla-1044354-00-a', category: 'cars', group: 'chassis', brand: 'Tesla (аналог)', partNumber: '1044354-00-A',
    titleUk: 'Важелі передні нижні з кульовою, пара', titleEn: 'Front lower control arms with ball joint, pair',
    fitsUk: 'Tesla Model 3 2017–2023, Model Y 2020–2023', fitsEn: 'Tesla Model 3 2017–2023, Model Y 2020–2023',
    type: 'analog', supplierPrice: 109.73, currency: 'USD', supplierIncVat: false, weightKg: 5,
    sourceUrl: 'https://www.fridayparts.com/front-left-right-lower-control-arm-ball-joint-1044354-00-a-1044351-00-c-for-2017-2023-tesla-model-3-y', checkedAt: D },
  { id: 'tesla-1107681-00-c', category: 'cars', group: 'filters', brand: 'Tesla', partNumber: '1107681-00-C',
    titleUk: 'Фільтр салону HVAC (комплект)', titleEn: 'HVAC cabin filter set',
    fitsUk: 'Tesla Model 3, Model Y', fitsEn: 'Tesla Model 3, Model Y',
    type: 'original', supplierPrice: 31, currency: 'USD', supplierIncVat: false, weightKg: 0.6,
    sourceUrl: 'https://evolutionparts.net/products/new-oem-tesla-model-3-y-hvac-combination-filter-1107681-00-c-1', checkedAt: D },
  { id: 'nissan-31728-28x0a', category: 'cars', group: 'hydraulics', brand: 'Nissan', partNumber: '31728-28X0A',
    titleUk: 'Фільтр варіатора CVT у зборі', titleEn: 'CVT transmission filter assembly',
    fitsUk: 'Nissan Rogue 2021+, X-Trail T33', fitsEn: 'Nissan Rogue 2021+, X-Trail T33',
    type: 'original', supplierPrice: 52.35, currency: 'USD', supplierIncVat: false, weightKg: 0.6,
    sourceUrl: 'https://www.z1offroad.com/auto-transmission/nissan/oem-21-nissan-rogue-transmission-filter-assembly-p-58781.html', checkedAt: D },
  { id: 'vw-5q0698151aj', category: 'cars', group: 'chassis', brand: 'Volkswagen', partNumber: '5Q0698151AJ',
    titleUk: 'Гальмівні колодки передні', titleEn: 'Front brake pads',
    fitsUk: 'VW Tiguan / Tiguan Allspace 2016–2020, 2.0 TDI', fitsEn: 'VW Tiguan / Tiguan Allspace 2016–2020, 2.0 TDI',
    type: 'original', supplierPrice: 150.7, currency: 'GBP', supplierIncVat: true, weightKg: 1.8,
    sourceUrl: 'https://coxmotorparts.co.uk/tiguan-allspace-2016-2020-2-0l-diesel-brakes/genuine-vw-tiguan-allspace-2016-2020-front-brake-pads-2-0l-tdi-5q0698151aj', checkedAt: D },
  { id: 'febi-106513', category: 'cars', group: 'engine', brand: 'Febi Bilstein', partNumber: '106513',
    titleUk: 'Комплект ланцюга ГРМ 2.0 TSI', titleEn: 'Timing chain kit 2.0 TSI',
    fitsUk: 'VW Tiguan 2009–2017, Passat, Jetta, Golf GTI 2.0 TSI', fitsEn: 'VW Tiguan 2009–2017, Passat, Jetta, Golf GTI 2.0 TSI',
    type: 'analog', supplierPrice: 349.89, currency: 'USD', supplierIncVat: false, weightKg: 3,
    sourceUrl: 'https://www.shopdap.com/timing-chain-kit-febi-vw-audi-2-0t-tsi.html', checkedAt: D },
  { id: 'mazda-pe01-14-302b', category: 'cars', group: 'filters', brand: 'Mazda', partNumber: 'PE01-14-302B',
    titleUk: 'Масляний фільтр', titleEn: 'Oil filter',
    fitsUk: 'Mazda CX-5, CX-3, 3, 6, MX-5 (1.5–2.5 бензин)', fitsEn: 'Mazda CX-5, CX-3, 3, 6, MX-5 (1.5–2.5 petrol)',
    type: 'original', supplierPrice: 16.11, currency: 'EUR', supplierIncVat: false, weightKg: 0.3,
    sourceUrl: 'https://www.vag247.com/en_US/p/Genuine-oil-filter-MAZDA-2-3-6-CX-3-CX-5-MX-5-1.5L-2.0L-2.5L/6712', checkedAt: D },
  { id: 'lemforder-38960-01', category: 'cars', group: 'chassis', brand: 'Lemförder', partNumber: '38960 01',
    titleUk: 'Важіль передній нижній лівий', titleEn: 'Front lower control arm, left',
    fitsUk: 'BMW X5 F15, X6 F16 (2013–2018)', fitsEn: 'BMW X5 F15, X6 F16 (2013–2018)',
    type: 'analog', supplierPrice: 137.99, currency: 'GBP', supplierIncVat: true, weightKg: 4,
    sourceUrl: 'https://www.autodoc.co.uk/lemforder/12795700', checkedAt: D },
  { id: 'hyundai-24321-2e010', category: 'cars', group: 'engine', brand: 'Hyundai / Kia', partNumber: '24321-2E010',
    titleUk: 'Ланцюг ГРМ', titleEn: 'Timing chain',
    fitsUk: 'Hyundai Kona, Elantra, Veloster; Kia Soul, Forte (2.0)', fitsEn: 'Hyundai Kona, Elantra, Veloster; Kia Soul, Forte (2.0)',
    type: 'original', supplierPrice: 128.94, currency: 'USD', supplierIncVat: false, weightKg: 1,
    sourceUrl: 'https://www.hyundaipartsdeal.com/genuine/hyundai-chain-timing~24321-2e010.html', checkedAt: D },
  { id: 'kyb-339702', category: 'cars', group: 'chassis', brand: 'KYB', partNumber: '339702',
    titleUk: 'Амортизатор передній правий Excel-G', titleEn: 'Front right shock absorber Excel-G',
    fitsUk: 'Opel Astra H, Zafira B', fitsEn: 'Opel Astra H, Zafira B',
    type: 'analog', supplierPrice: 71.99, currency: 'GBP', supplierIncVat: true, weightKg: 3,
    sourceUrl: 'https://www.autodoc.co.uk/kyb/827489', checkedAt: D },
];

export const FEATURED = CATALOG.filter((i) => i.featured);

// Повний каталог: вибрані позиції вище + знімок цін Kramp (public/data/catalog-kramp.json).
// Файл великий, тому вантажимо його тільки на сторінці каталогу.
let fullPromise: Promise<CatalogItem[]> | null = null;
export function loadFullCatalog(): Promise<CatalogItem[]> {
  if (!fullPromise) {
    fullPromise = fetch('/data/catalog-kramp.json')
      .then((r) => (r.ok ? r.json() : []))
      .then((extra: CatalogItem[]) => {
        const ids = new Set(CATALOG.map((i) => i.id));
        return [...CATALOG, ...extra.filter((i) => !ids.has(i.id))];
      })
      .catch(() => CATALOG);
  }
  return fullPromise;
}

// Ілюстрація за типом деталі для позицій без власного фото (public/illustrations/*.svg)
export function illustrationFor(item: CatalogItem): string {
  const t = `${item.titleUk} ${item.titleEn}`.toLowerCase();
  const map: [RegExp, string][] = [
    [/повітрян|air filter/, 'air-filter'],
    [/паливний фільтр|fuel filter|separator/, 'fuel-filter'],
    [/гідравлічний фільтр|hydraulic filter/, 'hydraulic-filter'],
    [/масляний фільтр|oil filter|lube/, 'oil-filter'],
    [/фільтр|filter/, 'filter'],
    [/підкачув|lift pump/, 'lift-pump'],
    [/помпа|water pump/, 'water-pump'],
    [/шестерен|gear pump|насос коробки|насос|pump unit|гідронасос/, 'gear-pump'],
    [/ремкомплект|seal/, 'seal-kit'],
    [/кардан|pto/, 'pto-shaft'],
    [/тяга|top link/, 'top-link'],
    [/стартер|starter/, 'starter'],
    [/генератор|alternator/, 'alternator'],
    [/склоочисн|wiper/, 'wiper-motor'],
    [/фара|light/, 'led-light'],
    [/свічка|glow/, 'glow-plug'],
    [/помпа|water pump/, 'water-pump'],
    [/турбо|turbo/, 'turbo'],
    [/форсунк|injector/, 'injector'],
    [/підкачув|lift pump/, 'lift-pump'],
    [/компресор|compressor/, 'ac-compressor'],
    [/амортизатор|strut/, 'gas-strut'],
    [/зуб|tooth|teeth/, 'bucket-tooth'],
    [/замок|lock/, 'door-lock'],
    [/колодк|brake/, 'brake-pads'],
  ];
  const hit = map.find(([re]) => re.test(t));
  return `/illustrations/${hit ? hit[1] : 'generic'}.svg`;
}

// ───────────── SEO-СТОРІНКИ ПІД ПОПУЛЯРНІ В УКРАЇНІ МОДЕЛІ ─────────────
// Топ імпорту вживаних авто в Україну 2026 (Укравтопром): Tiguan, Q5, Rogue, Escape, CX-5, Qashqai, X3, Model Y, X5, Q7.
export interface ModelPage {
  slug: string;
  name: string;
  match: RegExp;
  introUk: string;
}
export const MODEL_PAGES: ModelPage[] = [
  { slug: 'tesla-model-y', name: 'Tesla Model Y', match: /model y/i, introUk: 'Важелі підвіски, фільтри салону, гальма та кузовні деталі Tesla Model Y. Оригінал і якісні аналоги зі складів США та Європи.' },
  { slug: 'tesla-model-3', name: 'Tesla Model 3', match: /model 3/i, introUk: 'Ходова, фільтри, гальмівна система та кузов Tesla Model 3. Привеземо навіть те, чого немає в наявності в Україні.' },
  { slug: 'vw-tiguan', name: 'Volkswagen Tiguan', match: /tiguan/i, introUk: 'Гальмівні колодки, ланцюги ГРМ, фільтри та ходова VW Tiguan і Tiguan Allspace. Підбір за VIN.' },
  { slug: 'audi-q5', name: 'Audi Q5', match: /q5/i, introUk: 'Запчастини Audi Q5: ГРМ, підвіска, фільтри, гальма. Оригінал VAG і перевірені аналоги.' },
  { slug: 'nissan-rogue', name: 'Nissan Rogue', match: /rogue|x-trail/i, introUk: 'Фільтри та деталі варіатора CVT, ходова і гальма Nissan Rogue / X-Trail з США.' },
  { slug: 'mazda-cx-5', name: 'Mazda CX-5', match: /cx-5/i, introUk: 'Оригінальні фільтри, ходова та гальма Mazda CX-5. Оригінал Mazda і аналоги.' },
  { slug: 'bmw-x5', name: 'BMW X5', match: /x5|f15/i, introUk: 'Важелі, сайлентблоки, гальма та фільтри BMW X5 (F15, G05). Lemförder, Meyle, оригінал BMW.' },
  { slug: 'hyundai-kia', name: 'Hyundai / Kia', match: /hyundai|kia/i, introUk: 'Оригінал Mobis і аналоги для Hyundai Tucson, Kona, Sonata, Kia Sportage, Ceed, Niro: ГРМ, ходова, фільтри.' },
];
export function itemsForModel(m: ModelPage): CatalogItem[] {
  return CATALOG.filter((i) => m.match.test(`${i.fitsUk} ${i.fitsEn} ${i.titleEn}`));
}
