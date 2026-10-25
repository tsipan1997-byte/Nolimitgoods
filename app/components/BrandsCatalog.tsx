'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, CheckCircle2, MapPin, Layers, 
  Gauge, Cpu, Wrench, Filter, DoorClosed, Tractor, Check, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';

interface PartShowcaseItem {
  id: string;
  nameUk: string;
  nameEn: string;
  oem: string;
  brand: string;
  originUk: string;
  originEn: string;
  category: 'hydraulics' | 'undercarriage' | 'engines' | 'filtration' | 'cab' | 'tractors';
  tractorBrand?: 'case-ih' | 'massey-ferguson' | 'ford-nh' | 'kubota' | 'renault-claas' | 'deutz-fahr';
  tractorSection?: 'cab' | 'transmission' | 'hydraulics' | 'engine';
  image: string;
  popularOems: string[];
}

// 1. Головна вітрина: 8 ключових позицій (2 ряди по 4 картки)
const SHOWCASE_FEATURED: PartShowcaseItem[] = [
  {
    id: 'jcb-pump',
    nameUk: 'Головний гідравлічний насос JCB Parker',
    nameEn: 'JCB Parker Hydraulic Gear Pump',
    oem: '332/Y3163',
    brand: 'JCB GENUINE',
    originUk: 'Рочестер, Велика Британія',
    originEn: 'Rocester, UK',
    category: 'hydraulics',
    image: '/parts/JCB-PArker.jpg',
    popularOems: ['332/Y3163', '20/925327', '320/04186', '04/600786'],
  },
  {
    id: 'carraro-axle',
    nameUk: 'Тяжкий передній міст у зборі Carraro',
    nameEn: 'Carraro Heavy Duty Axle Assembly',
    oem: '149298',
    brand: 'CARRARO DRIVETECH',
    originUk: 'Камподарсего, Італія',
    originEn: 'Campodarsego, Italy',
    category: 'undercarriage',
    image: '/parts/Carraro.jpg',
    popularOems: ['149298', '047702', '125196', '140643'],
  },
  {
    id: 'rexroth-pump',
    nameUk: 'Регульований насос Bosch Rexroth A10VSO',
    nameEn: 'Bosch Rexroth Axial Piston Pump A10VSO',
    oem: 'A10VSO18DRG',
    brand: 'BOSCH REXROTH',
    originUk: 'Лор-ам-Майн, Німеччина',
    originEn: 'Lohr am Main, Germany',
    category: 'hydraulics',
    image: '/parts/Rexroth.jpg',
    popularOems: ['A10VSO18DRG', 'A10VSO71DFR', 'A4VG90EP4D1', 'A2FE107/61W'],
  },
  {
    id: 'perkins-cr',
    nameUk: 'Комплект паливних форсунок Perkins CR',
    nameEn: 'Perkins Fuel Injector Set Delphi',
    oem: '2645A747',
    brand: 'PERKINS ENGINES',
    originUk: 'Пітерборо, Велика Британія',
    originEn: 'Peterborough, UK',
    category: 'engines',
    image: '/parts/Perkins.jpg',
    popularOems: ['2645A747', 'U5MK8267', 'T413847', '2641A203'],
  },
  {
    id: 'cat-turbo',
    nameUk: 'Турбокомпресор Caterpillar Garrett C7/C9',
    nameEn: 'Caterpillar Turbocharger Assembly C7/C9',
    oem: '10R-7675',
    brand: 'CATERPILLAR (CAT)',
    originUk: 'Дистрибуція ЄС / UK Hub',
    originEn: 'EU Distribution / UK Hub',
    category: 'engines',
    image: '/parts/CAT.jpeg',
    popularOems: ['10R-7675', '326-1644', '224-3238', '1R-0716'],
  },
  {
    id: 'donaldson-filter',
    nameUk: 'Фільтр-сепаратор Donaldson Twist&Drain',
    nameEn: 'Donaldson Twist&Drain Fuel Separator',
    oem: 'P558000',
    brand: 'DONALDSON FILTRATION',
    originUk: 'Левен, Бельгія',
    originEn: 'Leuven, Belgium',
    category: 'filtration',
    image: '/parts/Donaldson.jpeg',
    popularOems: ['P558000', 'P553004', 'P535114', 'DBA5024'],
  },
  {
    id: 'danfoss-motor',
    nameUk: 'Гідромотор ходу / дозатор Danfoss OSPB',
    nameEn: 'Danfoss Steering Unit & Orbital Motor',
    oem: 'OSPB 160 ON',
    brand: 'DANFOSS MOBILE',
    originUk: 'Норборг, Данія',
    originEn: 'Nordborg, Denmark',
    category: 'hydraulics',
    image: '/parts/Danfoss.jpg',
    popularOems: ['OSPB 160 ON', 'OSPB 200 ON', 'OMT 250', 'PVG 32 157B'],
  },
  {
    id: 'fleetguard-filter',
    nameUk: 'Фільтр-водовіддільник Fleetguard FS1280',
    nameEn: 'Fleetguard Fuel/Water Separator FS1280',
    oem: 'FS1280',
    brand: 'FLEETGUARD CUMMINS',
    originUk: 'Склади UK та Європи',
    originEn: 'UK & European Stocks',
    category: 'filtration',
    image: '/parts/Fleetguard.jpeg',
    popularOems: ['FS1280', '3930942', 'FS19732', 'LF16015'],
  },
];

// 2. Підгрупи товарів
const SUBGROUP_PARTS: PartShowcaseItem[] = [
  // ==========================================
  // ТРАКТОРИ ТА АГРОТЕХНІКА (AGRILINE UK)
  // ==========================================
  // Case IH
  {
    id: 'tr-case-latch',
    nameUk: 'Case IH: Замок дверей кабіни XL (Slam Latch)',
    nameEn: 'Case IH XL Cab Door Inner Slam Latch',
    oem: '83994207',
    brand: 'CASE IH / AGRILINE UK',
    originUk: 'Agriline UK Depot',
    originEn: 'Agriline UK Depot',
    category: 'tractors',
    tractorBrand: 'case-ih',
    tractorSection: 'cab',
    image: '/parts/Gemini_Generated_Image_i8pfhi8pfhi8pfhi-2.jpg',
    popularOems: ['83994207', '15011', '81238', '1535127C1'],
  },
  {
    id: 'tr-case-handle',
    nameUk: 'Case IH: Зовнішня ручка дверей 110 мм',
    nameEn: 'Case IH Cab Door Exterior Pull Handle',
    oem: '3234209R1',
    brand: 'CASE IH / AGRILINE UK',
    originUk: 'Agriline UK Depot',
    originEn: 'Agriline UK Depot',
    category: 'tractors',
    tractorBrand: 'case-ih',
    tractorSection: 'cab',
    image: '/parts/Gemini_Generated_Image_i8pfhi8pfhi.jpg',
    popularOems: ['3234209R1', '15014', '15049', '15020'],
  },

  // Massey Ferguson
  {
    id: 'tr-mf-engine',
    nameUk: 'Massey Ferguson: Водяна помпа Perkins 4.236',
    nameEn: 'Massey Ferguson Perkins HD Water Pump',
    oem: '41312487',
    brand: 'MASSEY FERGUSON / PERKINS',
    originUk: 'Agriline UK Depot',
    originEn: 'Agriline UK Depot',
    category: 'tractors',
    tractorBrand: 'massey-ferguson',
    tractorSection: 'engine',
    image: '/parts/Perkins.jpg',
    popularOems: ['41312487', 'U5MW0010', '3637466M91', '41312167'],
  },
  {
    id: 'tr-mf-cab',
    nameUk: 'Massey Ferguson: Ручка та запірний замок дверей',
    nameEn: 'Massey Ferguson Cab Door Handle Assembly',
    oem: '3389410M1',
    brand: 'MASSEY FERGUSON',
    originUk: 'Agriline UK Depot',
    originEn: 'Agriline UK Depot',
    category: 'tractors',
    tractorBrand: 'massey-ferguson',
    tractorSection: 'cab',
    image: '/parts/Gemini_Generated_Image_i8pfhi8pfhi.jpg',
    popularOems: ['3389410M1', '3782012M1', '81240', '3389411M1'],
  },

  // Ford & New Holland
  {
    id: 'tr-nh-cab',
    nameUk: 'New Holland / Ford: Замок та фіксатор дверей кабіни',
    nameEn: 'Ford / New Holland Cab Door Catch & Lock Kit',
    oem: '83947477',
    brand: 'NEW HOLLAND / CNH',
    originUk: 'Agriline UK Depot',
    originEn: 'Agriline UK Depot',
    category: 'tractors',
    tractorBrand: 'ford-nh',
    tractorSection: 'cab',
    image: '/parts/Gemini_Generated_Image_i8pfhi8pfhi8pfhi-2.jpg',
    popularOems: ['83947477', 'E2NNB22050AA', '81868884', '82011854'],
  },
  {
    id: 'tr-nh-handle',
    nameUk: 'New Holland / Ford: Зовнішня ручка дверей кабіни',
    nameEn: 'Ford / New Holland Outer Door Handle Assembly',
    oem: '82011854',
    brand: 'NEW HOLLAND / CNH',
    originUk: 'Agriline UK Depot',
    originEn: 'Agriline UK Depot',
    category: 'tractors',
    tractorBrand: 'ford-nh',
    tractorSection: 'cab',
    image: '/parts/Gemini_Generated_Image_i8pfhi8pfhi.jpg',
    popularOems: ['82011854', '5165243', '81878051', '83996272'],
  },

  // Deutz-Fahr
  {
    id: 'tr-deutz-eng',
    nameUk: 'Deutz-Fahr: Турбокомпресор Agroplus / Agrotron',
    nameEn: 'Deutz-Fahr Turbocharger Assembly OEM',
    oem: '04284142',
    brand: 'DEUTZ AG OEM',
    originUk: 'Agriline UK Depot',
    originEn: 'Agriline UK Depot',
    category: 'tractors',
    tractorBrand: 'deutz-fahr',
    tractorSection: 'engine',
    image: '/parts/Deutz.jpeg',
    popularOems: ['04284142', '04287047', '02937441', '04207588'],
  },

  // Renault / CLAAS
  {
    id: 'tr-renault-cab',
    nameUk: 'Renault / CLAAS: Фурнітура та замок дверей кабіни',
    nameEn: 'Renault / CLAAS Cabin Door Latch Assembly',
    oem: '7700034685',
    brand: 'CLAAS / RENAULT AG',
    originUk: 'Agriline UK Depot',
    originEn: 'Agriline UK Depot',
    category: 'tractors',
    tractorBrand: 'renault-claas',
    tractorSection: 'cab',
    image: '/parts/Gemini_Generated_Image_i8pfhi8pfhi8pfhi-2.jpg',
    popularOems: ['7700034685', '6005022030', '149298', '81238'],
  },

  // Kubota
  {
    id: 'tr-kubota-cab',
    nameUk: 'Kubota M-Series: Замок дверей та натискна ручка',
    nameEn: 'Kubota M-Series Cab Door Lock & Handle Kit',
    oem: '3C081-82200',
    brand: 'KUBOTA AG OEM',
    originUk: 'Agriline UK Depot',
    originEn: 'Agriline UK Depot',
    category: 'tractors',
    tractorBrand: 'kubota',
    tractorSection: 'cab',
    image: '/parts/Gemini_Generated_Image_i8pfhi8pfhi.jpg',
    popularOems: ['3C081-82200', '3C081-82220', '3A111-82200', '70914'],
  },

  // ==========================================
  // КУЗОВ ТА КАБІНА (CAT CAB & BODY)
  // ==========================================
  {
    id: 'cab-cat-door',
    nameUk: 'Двері кабіни оператора CAT у зборі',
    nameEn: 'Operator Cab Door Assembly (CAT)',
    oem: '281-1196',
    brand: 'CATERPILLAR OEM',
    originUk: 'Дистрибуція ЄС / Finning UK Hub',
    originEn: 'EU Logistics / Finning UK Hub',
    category: 'cab',
    image: '/parts/images.jpeg',
    popularOems: ['281-1196', '281-1199', '280-7548', '280-7544'],
  },
  {
    id: 'cab-cat-roller',
    nameUk: 'Центральний роликовий кронштейн дверей CAT',
    nameEn: 'Cab Door Center Roller Bracket As',
    oem: '281-1199',
    brand: 'CATERPILLAR OEM',
    originUk: 'Finning UK Central Hub',
    originEn: 'Finning UK Central Hub',
    category: 'cab',
    image: '/parts/cronstain.jpeg',
    popularOems: ['281-1199', '281-1200', '281-6262', '281-6263'],
  },
  {
    id: 'cab-cat-lock',
    nameUk: 'Центральний замок дверей кабіни CAT',
    nameEn: 'Cabin Door Lock Mechanism As',
    oem: '280-7548',
    brand: 'CATERPILLAR OEM',
    originUk: 'Finning UK Central Hub',
    originEn: 'Finning UK Central Hub',
    category: 'cab',
    image: '/parts/Gemini_Generated_Image_i8pfhi8pfhi8pfhi-2.jpg',
    popularOems: ['280-7548', '280-7552', '293-3116', '132-7625'],
  },
  {
    id: 'cab-cat-handle',
    nameUk: 'Зовнішня ручка дверей 110 мм та важелі CAT',
    nameEn: '110mm Push Door Handle & Levers',
    oem: '280-7544',
    brand: 'CATERPILLAR OEM',
    originUk: 'Finning UK Central Hub',
    originEn: 'Finning UK Central Hub',
    category: 'cab',
    image: '/parts/Gemini_Generated_Image_i8pfhi8pfhi.jpg',
    popularOems: ['280-7544', '277-6030', '277-6031', '281-3650'],
  },

  // ==========================================
  // ФІЛЬТРАЦІЯ
  // ==========================================
  {
    id: 'filt-donaldson',
    nameUk: 'Donaldson: Twist&Drain та картриджі PowerCore',
    nameEn: 'Donaldson: Twist&Drain & PowerCore Media',
    oem: 'P558000',
    brand: 'DONALDSON FILTRATION',
    originUk: 'Левен, Бельгія',
    originEn: 'Leuven, Belgium',
    category: 'filtration',
    image: '/parts/Donaldson.jpeg',
    popularOems: ['P558000', 'P553004', 'P535114', 'P550425'],
  },
  {
    id: 'filt-fleetguard',
    nameUk: 'Fleetguard FS1280 (Cummins 3930942)',
    nameEn: 'Fleetguard FS1280 Cummins Separator',
    oem: 'FS1280',
    brand: 'FLEETGUARD CUMMINS',
    originUk: 'Склади UK та Європи',
    originEn: 'UK & European Hubs',
    category: 'filtration',
    image: '/parts/Fleetguard.jpeg',
    popularOems: ['FS1280', '3930942', 'FS19732', 'LF16015'],
  },
  {
    id: 'filt-mann',
    nameUk: 'Mann-Filter: Промислова паливна та масляна очистка',
    nameEn: 'Mann-Filter: Heavy Fuel & Lube Filtration',
    oem: 'WD13145',
    brand: 'MANN-FILTER HUMMEL',
    originUk: 'Людвігсбург, Німеччина',
    originEn: 'Ludwigsburg, Germany',
    category: 'filtration',
    image: '/parts/Mann-Filter.jpeg',
    popularOems: ['WD13145', 'WK950/21', 'HD1047', 'C25710'],
  },
  {
    id: 'filt-pall',
    nameUk: 'Pall Corporation: Надвисока прецизійна фільтрація',
    nameEn: 'Pall Corporation: Ultra-Precision Core Filters',
    oem: 'HC9600FKS16H',
    brand: 'PALL INDUSTRIAL',
    originUk: 'Портсмут, Велика Британія',
    originEn: 'Portsmouth, UK',
    category: 'filtration',
    image: '/parts/Pall.jpeg',
    popularOems: ['HC9600FKS16H', 'UE319AS20H', 'HC8314FKN39H', 'HC9021FDT8Z'],
  },

  // ==========================================
  // ДВИГУНИ
  // ==========================================
  {
    id: 'eng-perkins',
    nameUk: 'Perkins Engines: Форсунки Common Rail та поршні',
    nameEn: 'Perkins: CR Injectors & Liner Kits',
    oem: '2645A747',
    brand: 'PERKINS ENGINES',
    originUk: 'Пітерборо, Велика Британія',
    originEn: 'Peterborough, UK',
    category: 'engines',
    image: '/parts/Perkins.jpg',
    popularOems: ['2645A747', 'U5MK8267', 'T413847', 'U5PR0062'],
  },
  {
    id: 'eng-cat',
    nameUk: 'Caterpillar (CAT): Турбіни Garrett C7/C9 та ТНВД',
    nameEn: 'Caterpillar: C7/C9 Turbochargers & Pumps',
    oem: '10R-7675',
    brand: 'CATERPILLAR (CAT)',
    originUk: 'Дистрибуція ЄС та UK',
    originEn: 'EU & UK Distribution',
    category: 'engines',
    image: '/parts/CAT.jpeg',
    popularOems: ['10R-7675', '326-1644', '224-3238', '387-9427'],
  },
  {
    id: 'eng-cummins',
    nameUk: 'Cummins: Паливна апаратура ISB/QSB, сенсори',
    nameEn: 'Cummins: ISB/QSB Injection & Sensors',
    oem: '5263262',
    brand: 'CUMMINS POWER',
    originUk: 'Дарлінгтон, Велика Британія',
    originEn: 'Darlington, UK',
    category: 'engines',
    image: '/parts/Cummins.jpeg',
    popularOems: ['5263262', '4937766', '4089744', '2872277'],
  },
  {
    id: 'eng-deutz',
    nameUk: 'Deutz AG: Турбокомпресори та гільзо-поршнева група',
    nameEn: 'Deutz AG: Turbos & Cylinder Assemblies',
    oem: '04284142',
    brand: 'DEUTZ AG',
    originUk: 'Кельн, Німеччина',
    originEn: 'Cologne, Germany',
    category: 'engines',
    image: '/parts/Deutz.jpeg',
    popularOems: ['04284142', '04287047', '02937441', '04207588'],
  },

  // ==========================================
  // ГІДРАВЛІКА
  // ==========================================
  {
    id: 'hyd-jcb',
    nameUk: 'JCB Parker: Спарені насоси та мотори 3CX/4CX',
    nameEn: 'JCB Parker: Tandem Hydraulic Pumps',
    oem: '332/Y3163',
    brand: 'JCB GENUINE',
    originUk: 'Рочестер, Велика Британія',
    originEn: 'Rocester, UK',
    category: 'hydraulics',
    image: '/parts/JCB-PArker.jpg',
    popularOems: ['332/Y3163', '20/925327', '320/04186', '04/600786'],
  },
  {
    id: 'hyd-rexroth',
    nameUk: 'Bosch Rexroth: Насоси A10VSO та мотори ходу',
    nameEn: 'Bosch Rexroth: A10VSO Pumps & Travel Motors',
    oem: 'A10VSO18DRG',
    brand: 'BOSCH REXROTH',
    originUk: 'Лор-ам-Майн, Німеччина',
    originEn: 'Lohr am Main, Germany',
    category: 'hydraulics',
    image: '/parts/Rexroth.jpg',
    popularOems: ['A10VSO18DRG', 'A10VSO71DFR', 'A4VG90EP4D1', '4WE6D6X'],
  },
  {
    id: 'hyd-danfoss',
    nameUk: 'Danfoss: Орбітроли керма OSPB та блоки PVG 32',
    nameEn: 'Danfoss: OSPB Steering Units & PVG 32 Valves',
    oem: 'OSPB 160 ON',
    brand: 'DANFOSS MOBILE',
    originUk: 'Норборг, Данія',
    originEn: 'Nordborg, Denmark',
    category: 'hydraulics',
    image: '/parts/Danfoss.jpg',
    popularOems: ['OSPB 160 ON', 'OSPB 200 ON', 'OMT 250', 'PVG 32 157B'],
  },
  {
    id: 'hyd-eaton',
    nameUk: 'Eaton Vickers: Промислові гідроагрегати та клапани',
    nameEn: 'Eaton Vickers: Heavy Hydraulic Pumps & Valves',
    oem: '25V21A1A22R',
    brand: 'EATON VICKERS',
    originUk: 'Хавант, Велика Британія',
    originEn: 'Havant, UK',
    category: 'hydraulics',
    image: '/parts/Eaton%20Vickers.jpeg',
    popularOems: ['25V21A1A22R', '35V38A1A22R', 'DG4V-3-2A', 'PVH098R'],
  },

  // ==========================================
  // МОСТИ ТА ХОДОВА
  // ==========================================
  {
    id: 'und-carraro',
    nameUk: 'Carraro Drivetech: Мости в зборі, шестерні, шворні',
    nameEn: 'Carraro: Complete Axles & Differential Kits',
    oem: '149298',
    brand: 'CARRARO DRIVETECH',
    originUk: 'Камподарсего, Італія',
    originEn: 'Campodarsego, Italy',
    category: 'undercarriage',
    image: '/parts/Carraro.jpg',
    popularOems: ['149298', '047702', '125196', '140643'],
  },
  {
    id: 'und-zf',
    nameUk: 'ZF Friedrichshafen: Бортові редуктори мостів',
    nameEn: 'ZF: Heavy Axle Reducers & Planetaries',
    oem: '0501.216.002',
    brand: 'ZF FRIEDRICHSHAFEN',
    originUk: 'Фрідріхсгафен, Німеччина',
    originEn: 'Friedrichshafen, Germany',
    category: 'undercarriage',
    image: '/parts/ZF.jpeg',
    popularOems: ['0501.216.002', '0501.322.845', '4143.040.001', '0734.319.418'],
  },
  {
    id: 'und-spicer',
    nameUk: 'Dana Spicer: Кардани, диференціали, хрестовини',
    nameEn: 'Dana Spicer: Cardan Shafts & Heavy Diffs',
    oem: '213.12.012.01',
    brand: 'DANA SPICER',
    originUk: 'Монселіче, Італія',
    originEn: 'Monselice, Italy',
    category: 'undercarriage',
    image: '/parts/Dana%20Spicer.jpeg',
    popularOems: ['213.12.012.01', '012.052.02', '212.09.045', '311.08.019'],
  },
  {
    id: 'und-jcb',
    nameUk: 'JCB Undercarriage: Поворотні кулаки, редуктори 3CX',
    nameEn: 'JCB Undercarriage: Steering Knuckles & Hubs',
    oem: '458/20403',
    brand: 'JCB PARTS UK',
    originUk: 'Рочестер, Велика Британія',
    originEn: 'Rocester, UK',
    category: 'undercarriage',
    image: '/parts/JCB-PArker.jpg',
    popularOems: ['458/20403', '450/10206', '04/600786', '714/40526'],
  },
];

export default function BrandsCatalog({ onSelectOem }: { onSelectOem: (oem: string, brandName: string) => void }) {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const [selectedTractorBrand, setSelectedTractorBrand] = useState<string>('ford-nh');
  const [selectedTractorSection, setSelectedTractorSection] = useState<string>('all');

  const mainTabs = [
    { id: 'all', labelUk: 'Всі ключові вузли (Топ-8)', labelEn: 'All Key Assemblies (Top 8)', icon: Layers },
    { id: 'tractors', labelUk: 'Трактори та Агро (Оригінали та аналоги)', labelEn: 'Tractors & Agri (OEM & Aftermarket)', icon: Tractor },
    { id: 'cab', labelUk: 'Кузов та кабіна CAT', labelEn: 'CAT Cab & Body', icon: DoorClosed },
    { id: 'filtration', labelUk: 'Фільтрація', labelEn: 'Filtration', icon: Filter },
    { id: 'engines', labelUk: 'Двигуни та CR', labelEn: 'Engines & CR', icon: Cpu },
    { id: 'hydraulics', labelUk: 'Гідравліка', labelEn: 'Hydraulics', icon: Gauge },
    { id: 'undercarriage', labelUk: 'Мости та редуктори', labelEn: 'Axles & Transmission', icon: Wrench },
  ];

  // 6 брендів тракторів
  const tractorCards = [
    { 
      id: 'ford-nh', 
      name: 'Ford & New Holland', 
      image: '/parts/ford_&_fordson_60_series.png.webp', 
      badge: '60 Series, TS, TM, T6' 
    },
    { 
      id: 'case-ih', 
      name: 'Case IH / International', 
      image: '/parts/case_international_puma_series.png.webp', 
      badge: 'Puma, Maxxum, XL' 
    },
    { 
      id: 'massey-ferguson', 
      name: 'Massey Ferguson', 
      image: '/parts/Massey_Ferguson_1_1.png.webp', 
      badge: 'MF 300, 5400, 6400' 
    },
    { 
      id: 'deutz-fahr', 
      name: 'Deutz-Fahr', 
      image: '/parts/deutz_agroplus_series.png.webp', 
      badge: 'Agroplus, Agrotron' 
    },
    { 
      id: 'renault-claas', 
      name: 'Renault / CLAAS', 
      image: '/parts/renault_celtis.png.webp', 
      badge: 'Celtis, Ares, Ceres' 
    },
    { 
      id: 'kubota', 
      name: 'Kubota Agricultural', 
      image: '/parts/Kubota-M-Series.png.webp', 
      badge: 'M-Series, ME, M9000' 
    },
  ];

  const tractorSections = [
    { id: 'all', labelUk: 'Всі системи', labelEn: 'All Systems' },
    { id: 'cab', labelUk: 'Кабіна та двері', labelEn: 'Cab & Doors' },
    { id: 'engine', labelUk: 'Двигун та охолодження', labelEn: 'Engine & Cooling' },
    { id: 'hydraulics', labelUk: 'Гідравліка та навіска', labelEn: 'Hydraulics & Linkage' },
    { id: 'transmission', labelUk: 'Зчеплення та КПП', labelEn: 'Clutch & Gearbox' },
  ];

  const displayedList = activeTab === 'all'
    ? SHOWCASE_FEATURED
    : activeTab === 'tractors'
      ? SUBGROUP_PARTS.filter(p => {
          if (p.category !== 'tractors') return false;
          if (p.tractorBrand !== selectedTractorBrand) return false;
          if (selectedTractorSection !== 'all' && p.tractorSection !== selectedTractorSection) return false;
          return true;
        })
      : SUBGROUP_PARTS.filter(p => p.category === activeTab);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, originalPath: string) => {
    const target = e.currentTarget;
    const currentSrc = target.getAttribute('src') || '';

    if (!currentSrc.startsWith('http') && !currentSrc.startsWith('/app/public/')) {
      target.src = '/app/public' + originalPath;
    } else {
      target.src = '/parts/JCB-PArker.jpg';
    }
  };

  return (
    <section id="oem-brands" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200 scroll-mt-24">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Заголовок */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {isUk ? 'Прямі відвантаження з британських складів • 0% UK VAT' : 'Direct UK Dispatches • 0% UK VAT'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {isUk ? 'Оригінальні вузли та перевірені замінники в наявності' : 'Genuine OEM & Aftermarket Assemblies in Stock'}
          </h2>
          <p className="max-w-2xl mx-auto text-slate-600 text-sm sm:text-base">
            {isUk 
              ? 'Оберіть марку техніки або групу агрегатів для отримання актуальних цін з британських хабів Agriline, Finning та Bepco.'
              : 'Select your machinery brand or equipment group for direct trade pricing from UK warehouses.'}
          </p>
        </div>

        {/* Головні таби категорій */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {mainTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {isUk ? tab.labelUk : tab.labelEn}
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* РОЗДІЛ: ТРАКТОРИ (ШІСТЬ БРЕНДІВ З AGRILINE + ВУЗЛИ)     */}
        {/* ======================================================== */}
        {activeTab === 'tractors' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
          >
            {/* 1. Сітка вибору марки трактора */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {tractorCards.map((tractor) => {
                const isSelected = selectedTractorBrand === tractor.id;
                return (
                  <button
                    key={tractor.id}
                    type="button"
                    onClick={() => {
                      setSelectedTractorBrand(tractor.id as any);
                      setSelectedTractorSection('all');
                    }}
                    className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between overflow-hidden group ${
                      isSelected 
                        ? 'bg-white border-red-600 shadow-md ring-2 ring-red-600/20' 
                        : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="w-full h-24 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden mb-2">
                      <img 
                        src={tractor.image} 
                        alt={tractor.name}
                        className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => handleImageError(e, tractor.image)}
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        {tractor.badge}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs leading-tight flex items-center justify-between mt-0.5">
                        <span className="truncate">{tractor.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-red-600 shrink-0 ml-1" />}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 2. Підпункти систем для вибраної марки */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {isUk ? 'Вузли для обраної марки:' : 'Assembly Sections:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tractorSections.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedTractorSection(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedTractorSection === s.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isUk ? s.labelUk : s.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* СІТКА КАРТОК ЗАПЧАСТИН                                  */}
        {/* ======================================================== */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedList.length > 0 ? (
              displayedList.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  {/* Фотографія деталі */}
                  <div className="relative w-full h-48 bg-white p-3 flex items-center justify-center overflow-hidden border-b border-slate-100">
                    <img
                      src={item.image}
                      alt={item.nameEn}
                      className="w-full h-full object-contain p-1 rounded-lg group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => handleImageError(e, item.image)}
                    />
                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-1.5 text-[10px] font-bold text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isUk ? 'В наявності UK' : 'In Stock UK'}</span>
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-slate-900 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                      0% VAT
                    </div>
                  </div>

                  {/* Інформація */}
                  <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-slate-500 text-[11px] mb-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{isUk ? item.originUk : item.originEn}</span>
                      </div>

                      <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-0.5">
                        {item.brand}
                      </div>

                      <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-slate-950 transition-colors line-clamp-2">
                        {isUk ? item.nameUk : item.nameEn}
                      </h3>
                    </div>

                    {/* Ходові OEM */}
                    <div className="space-y-1 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        {isUk ? 'OEM та крос-номери:' : 'OEM & Cross Numbers:'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.popularOems.map((code) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => onSelectOem(code, item.brand)}
                            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 font-mono text-[11px] font-bold transition-colors border border-slate-200/70 cursor-pointer"
                            title={isUk ? `Розрахувати ${code}` : `Calculate ${code}`}
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Кнопка переходу в калькулятор */}
                    <button
                      type="button"
                      onClick={() => onSelectOem(item.oem, item.brand)}
                      className="w-full mt-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                    >
                      <span>{isUk ? 'Розрахувати вартість' : 'Get Quote'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Package className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  {isUk ? 'Вузол доступний під пряме замовлення з хабу' : 'Section available upon direct trade request'}
                </h4>
                <p className="max-w-md mx-auto text-xs text-slate-500">
                  {isUk 
                    ? 'Поставки з британського складу Agriline Products та Bepco. Введіть каталожний номер деталі або VIN у форму вище для миттєвого підбору.'
                    : 'Dispatched from Agriline Products UK & Bepco warehouses. Enter your OEM code into the search form above.'}
                </p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
