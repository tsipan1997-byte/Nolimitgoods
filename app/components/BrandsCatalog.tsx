'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Layers,
  Filter,
  Cpu,
  Gauge,
  Wrench,
  DoorClosed,
  Tractor,
  Check,
  Copy,
  Plane,
  Factory,
  Droplets,
  Sparkles,
  Car,
  HardHat,
  Disc,
  Cog,
  ImageOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export interface PartShowcaseItem {
  id: string;
  nameUk: string;
  nameEn: string;
  oem: string;
  brand: string;
  originUk: string;
  originEn: string;
  category:
    | 'cab'
    | 'filtration'
    | 'engines'
    | 'hydraulics'
    | 'undercarriage'
    | 'pall'
    | 'suspension'
    | 'spec-korea'
    | 'cars-korea';
  /** Порожній рядок = фото ще немає, покажеться заглушка */
  image: string;
  popularOems: string[];
  badgeUk?: string;
  badgeEn?: string;
  isKoreaHub?: boolean;
}

// ─────────────────────────────────────────────────────────────
// ЄДИНЕ МІСЦЕ ДЛЯ ШЛЯХІВ ДО ФОТО (всі файли лежать у /public/parts)
// Назви файлів чутливі до регістру на Vercel!
// ─────────────────────────────────────────────────────────────
const IMG = {
  // Техніка / агро
  jcbPump: '/parts/JCB-PArker.jpg', // велика A — саме так файл названий у репо
  caseAccuboom: '/parts/case_international_puma_series.png.webp',
  carraroAxle: '/parts/carraro-axle.jpg',
  catCabDoor: '/parts/cat-cab-door.jpg',
  catDoorLatch: '/parts/cat-door-lock.jpg',
  catDoorBracket: '/parts/cat-door-roller-bracket.jpg',
  catDoorLockHandle: '/parts/cat-door-lock-handle.jpg',
  sandenCompressor: '/parts/sanden-compressor.jpg',
  rexroth: '/parts/Rexroth.jpg',

  // Двигуни / фільтрація
  perkins: '/parts/Perkins.jpg',
  donaldson: '/parts/Donaldson.jpeg',
  pall: '/parts/Pall.jpeg',

  // Амортизатори
  kybStrut: '/parts/KYBstrudass.webp',
  kybRear: '/parts/kyb-rear-shock.jpg',
  monroeMagnum: '/parts/monroe-magnum-shock.jpg',

  // Hyundai: спецтехніка
  hyundaiPump: '/parts/hyundai-pump.jpg',
  hyundaiMainPump: '/parts/hyundai-main-pump.jpg',
  hyundaiTrackRoller: '/parts/hyundai-track-roller.jpg',
  hyundaiSprocket: '/parts/Spocket.jpeg', // так, у репо саме "Spocket"
  hyundaiSealKit: '/parts/Remcomp.jpeg',

  // Hyundai: легкові
  hyundaiEcuKeys: '/parts/hyundai-ecu-keys.jpg',
  hyundaiEcu: '/parts/hyundai-ecu.jpg',
  mobisLedOptics: '', // TODO: фото LED-оптики
  mandoSuspension: '', // TODO: фото важелів / кульових опор Mando
} as const;

// 1. ТОП-12 КЛЮЧОВИХ ПОЗИЦІЙ (ГОЛОВНА ВІТРИНА)
const SHOWCASE_FEATURED: PartShowcaseItem[] = [
  {
    id: 'jcb-pump',
    nameUk: 'Головний гідравлічний насос JCB Parker 3CX/4CX',
    nameEn: 'JCB Parker Main Hydraulic Gear Pump',
    oem: '332/Y3163',
    brand: 'JCB GENUINE / PARKER',
    originUk: 'Рочестер, Велика Британія',
    originEn: 'Rocester, UK',
    category: 'hydraulics',
    image: IMG.jcbPump,
    popularOems: ['332/Y3163', '20/925327', '333/G5390', '20/925339'],
  },
  {
    id: 'case-accuboom',
    nameUk: 'Блок управління обприскувача Case AccuBoom Unit',
    nameEn: 'Case IH AccuBoom Boom Control Unit',
    oem: '87643472',
    brand: 'CASE IH / RAVEN',
    originUk: 'Дистрибуція ЄС / UK Hub',
    originEn: 'EU Logistics / UK Hub',
    category: 'cab',
    image: IMG.caseAccuboom,
    popularOems: ['87643472', '47773024', '83994207', '3234209R1'],
  },
  {
    id: 'carraro-axle',
    nameUk: 'Тяжкий передній міст у зборі Carraro Drivetech',
    nameEn: 'Carraro Heavy Duty Axle Assembly',
    oem: '149298',
    brand: 'CARRARO DRIVETECH',
    originUk: 'Камподарсего, Італія',
    originEn: 'Campodarsego, Italy',
    category: 'undercarriage',
    image: IMG.carraroAxle,
    popularOems: ['149298', '047702', '125196', '140643'],
  },
  {
    id: 'cab-cat-door',
    nameUk: 'Двері кабіни оператора CAT у зборі (281-1196)',
    nameEn: 'Operator Cab Door Assembly (CAT)',
    oem: '281-1196',
    brand: 'CATERPILLAR OEM',
    originUk: 'Дистрибуція ЄС / Finning UK Hub',
    originEn: 'EU Logistics / Finning UK Hub',
    category: 'cab',
    image: IMG.catCabDoor,
    popularOems: ['281-1196', '281-1199', '293-3116', '280-7548'],
  },
  {
    id: 'cab-case-compressor',
    nameUk: 'Компресор кондиціонера Sanden Case Stackcruiser',
    nameEn: 'Case Stackcruiser Sanden AC Compressor',
    oem: '47773024',
    brand: 'CASE IH / SANDEN',
    originUk: 'Дистрибуція ЄС / UK Depot',
    originEn: 'EU Logistics / UK Depot',
    category: 'cab',
    image: IMG.sandenCompressor,
    popularOems: ['47773024', '87643472', '83994207', '3234209R1'],
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
    image: IMG.rexroth,
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
    image: IMG.perkins,
    popularOems: ['2645A747', 'U5MK8267', 'T413847', '2641A203'],
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
    image: IMG.donaldson,
    popularOems: ['P558000', 'P553004', 'P535114', 'SH60187'],
  },
  {
    id: 'pall-featured',
    nameUk: 'Фільтроелементи високого тиску Pall Ultipor / Coralon',
    nameEn: 'Pall High-Pressure Hydraulic Elements',
    oem: 'HC9600FKN8H',
    brand: 'PALL CORPORATION',
    originUk: 'Портсмут, Велика Британія',
    originEn: 'Portsmouth, UK',
    category: 'pall',
    image: IMG.pall,
    popularOems: ['HC9600FKN8H', 'HC8314FKN39Z', 'UE319AP20Z', 'HC2216FKS6Z'],
  },
  {
    id: 'kyb-monroe-featured',
    nameUk: 'Амортизатори та стійки підвіски KYB / Monroe',
    nameEn: 'KYB & Monroe Heavy-Duty Shock Absorbers',
    oem: 'SR4198',
    brand: 'KYB / MONROE',
    originUk: 'Склади UK та ЄС',
    originEn: 'UK & EU Hubs',
    category: 'suspension',
    image: IMG.kybStrut,
    popularOems: ['SR4198', '339702', '349041', 'G8107'],
  },
  {
    id: 'korea-spec-featured',
    nameUk: 'Головний гідравлічний насос Hyundai Robex R210 / R220',
    nameEn: 'Hyundai Robex Excavator Main Hydraulic Pump',
    oem: '31N6-10010',
    brand: 'HYUNDAI HEAVY IND.',
    originUk: 'Ульсан, Південна Корея',
    originEn: 'Ulsan, South Korea',
    category: 'spec-korea',
    image: IMG.hyundaiPump,
    popularOems: ['31N6-10010', '31Q6-10010', 'E181-2002BG', '81EM-10010'],
    badgeUk: 'Південна Корея',
    badgeEn: 'South Korea',
    isKoreaHub: true,
  },
  {
    id: 'korea-cars-featured',
    nameUk: 'Електронні блоки ECU, смарт-ключі та оптика Hyundai / Kia Mobis',
    nameEn: 'Hyundai / Kia Mobis Genuine ECU, Smart Keys & Optics',
    oem: '39110-2B010',
    brand: 'HYUNDAI MOBIS GENUINE',
    originUk: 'Сеул, Південна Корея',
    originEn: 'Seoul, South Korea',
    category: 'cars-korea',
    image: IMG.hyundaiEcuKeys,
    popularOems: ['39110-2B010', '95440-G5000', '92101-G6000', '54651-C1000'],
    badgeUk: 'Південна Корея',
    badgeEn: 'South Korea',
    isKoreaHub: true,
  },
];

// 2. ДЕТАЛІЗОВАНІ КАРТКИ ПІДГРУП КАТАЛОГУ
const SUBGROUP_PARTS: PartShowcaseItem[] = [
  // --- АМОРТИЗАТОРИ ТА ПІДВІСКА (KYB / MONROE) ---
  {
    id: 'susp-kyb-strut-right',
    nameUk: 'Стійка передня права у зборі з пружиною KYB Strut-Plus / Monroe Quick-Strut',
    nameEn: 'Front Right Complete Strut Assembly (KYB Strut-Plus / Monroe)',
    oem: 'SR4198',
    brand: 'KYB CORPORATION',
    originUk: 'Склади UK та ЄС',
    originEn: 'UK & EU Hubs',
    category: 'suspension',
    image: IMG.kybStrut,
    popularOems: ['SR4198', 'SR4458', '172518', '172926'],
  },
  {
    id: 'susp-kyb-strut-left',
    nameUk: 'Стійка передня ліва у зборі з пружиною KYB Strut-Plus / Monroe Quick-Strut',
    nameEn: 'Front Left Complete Strut Assembly (KYB Strut-Plus / Monroe)',
    oem: 'SR4199',
    brand: 'KYB CORPORATION',
    originUk: 'Склади UK та ЄС',
    originEn: 'UK & EU Hubs',
    category: 'suspension',
    image: IMG.kybStrut,
    popularOems: ['SR4199', 'SR4459', '172519', '172927'],
  },
  {
    id: 'susp-kyb-excelg-bare',
    nameUk: 'Газомасляний амортизатор задній (не в зборі) KYB Excel-G / Gas-a-Just',
    nameEn: 'KYB Excel-G & Gas-a-Just Rear Bare Shock Absorber',
    oem: '339702',
    brand: 'KYB CORPORATION',
    originUk: 'Дистрибуція ЄС / UK Hub',
    originEn: 'EU Logistics / UK Hub',
    category: 'suspension',
    image: IMG.kybRear,
    popularOems: ['339702', '339703', '349041', '554384'],
  },
  {
    id: 'susp-monroe-magnum',
    nameUk: 'Посилені амортизатори шасі Monroe Magnum та OESpectrum',
    nameEn: 'Monroe Magnum Heavy-Duty & OESpectrum Shocks',
    oem: 'G8107',
    brand: 'MONROE TENNECO',
    originUk: 'Сент-Трейден, Бельгія',
    originEn: 'Sint-Truiden, Belgium',
    category: 'suspension',
    image: IMG.monroeMagnum,
    popularOems: ['G8107', 'G8108', 'CB0069', 'V4505'],
  },

  // --- СПЕЦТЕХНІКА З КОРЕЇ (HYUNDAI CONSTRUCTION) ---
  {
    id: 'korea-spec-pump',
    nameUk: 'Головний гідравлічний насос Hyundai Robex R210 / R220',
    nameEn: 'Hyundai Robex Excavator Main Hydraulic Pump',
    oem: '31N6-10010',
    brand: 'HYUNDAI HEAVY IND.',
    originUk: 'Ульсан, Південна Корея',
    originEn: 'Ulsan, South Korea',
    category: 'spec-korea',
    image: IMG.hyundaiMainPump,
    popularOems: ['31N6-10010', '31Q6-10010', '31E30018', 'E131-0212A'],
    badgeUk: 'Південна Корея',
    badgeEn: 'South Korea',
    isKoreaHub: true,
  },
  {
    id: 'korea-spec-roller',
    nameUk: 'Опорний каток ходової частини Hyundai R210 / R220 / R250',
    nameEn: 'Hyundai Heavy Duty Lower Track Roller',
    oem: 'E181-2002BG',
    brand: 'HYUNDAI HEAVY IND.',
    originUk: 'Ульсан, Південна Корея',
    originEn: 'Ulsan, South Korea',
    category: 'spec-korea',
    image: IMG.hyundaiTrackRoller,
    popularOems: ['E181-2002BG', '81EM-10030BG', '81EM-10010', '81N6-13010BG'],
    badgeUk: 'Південна Корея',
    badgeEn: 'South Korea',
    isKoreaHub: true,
  },
  {
    id: 'korea-spec-sprocket',
    nameUk: 'Зірочка тягова гусеничного ходу (Sprocket) Hyundai R210',
    nameEn: 'Hyundai R210 Track Drive Sprocket',
    oem: '81EM-10010',
    brand: 'HYUNDAI HEAVY IND.',
    originUk: 'Ульсан, Південна Корея',
    originEn: 'Ulsan, South Korea',
    category: 'spec-korea',
    image: IMG.hyundaiSprocket,
    popularOems: ['81EM-10010', '81EM-10013BG', '81N6-23600', '81N6-13010BG'],
    badgeUk: 'Південна Корея',
    badgeEn: 'South Korea',
    isKoreaHub: true,
  },
  {
    id: 'korea-spec-seals',
    nameUk: 'Ремкомплект гідроциліндрів стріли та ковша Hyundai Robex',
    nameEn: 'Hyundai Robex Boom & Bucket Cylinder Seal Kit',
    oem: '31Y1-15705',
    brand: 'HYUNDAI HEAVY IND.',
    originUk: 'Ульсан, Південна Корея',
    originEn: 'Ulsan, South Korea',
    category: 'spec-korea',
    image: IMG.hyundaiSealKit,
    popularOems: ['31Y1-15705', '31Y1-15885', '31Q6-01280', 'E131-0212A'],
    badgeUk: 'Південна Корея',
    badgeEn: 'South Korea',
    isKoreaHub: true,
  },

  // --- ЛЕГКОВІ АВТО З КОРЕЇ (HYUNDAI / KIA / GENESIS MOBIS) ---
  {
    id: 'korea-car-ecu',
    nameUk: 'Електронні блоки управління двигуном (ECU) та смарт-ключі Mobis',
    nameEn: 'Hyundai / Kia Genuine ECU Modules & Smart Keys',
    oem: '39110-2B010',
    brand: 'HYUNDAI MOBIS GENUINE',
    originUk: 'Сеул, Південна Корея',
    originEn: 'Seoul, South Korea',
    category: 'cars-korea',
    image: IMG.hyundaiEcu,
    popularOems: ['39110-2B010', '95440-G5000', '95440-D4000', '39101-2E150'],
    badgeUk: 'Південна Корея',
    badgeEn: 'South Korea',
    isKoreaHub: true,
  },
  {
    id: 'korea-car-optics',
    nameUk: 'Оригінальна передня LED-оптика та блоки Hyundai / Kia / Genesis',
    nameEn: 'Genuine LED Modules & Optics Hyundai / Kia',
    oem: '92101-G6000',
    brand: 'HYUNDAI MOBIS GENUINE',
    originUk: 'Сеул, Південна Корея',
    originEn: 'Seoul, South Korea',
    category: 'cars-korea',
    image: IMG.mobisLedOptics,
    popularOems: ['92101-G6000', '92102-G6000', '92401-D3100', '92101-S1100'],
    badgeUk: 'Південна Корея',
    badgeEn: 'South Korea',
    isKoreaHub: true,
  },
  {
    id: 'korea-car-suspension',
    nameUk: 'Важелі підвіски, кульові опори та маточини Mando / CTR / Mobis',
    nameEn: 'Control Arms, Ball Joints & Wheel Hubs Mando / CTR',
    oem: '54500-C1000',
    brand: 'MOBIS / MANDO / CTR',
    originUk: 'Пхьонтхек, Південна Корея',
    originEn: 'Pyeongtaek, South Korea',
    category: 'cars-korea',
    image: IMG.mandoSuspension,
    popularOems: ['54500-C1000', '54501-C1000', '51750-C1000', '54651-C1000'],
    badgeUk: 'Південна Корея',
    badgeEn: 'South Korea',
    isKoreaHub: true,
  },
  {
    id: 'korea-car-engine',
    nameUk: 'Комплекти ГРМ, фазорегулятори CVVT та паливні форсунки GDI/CRDi',
    nameEn: 'Timing Chain Kits, CVVT Gears & GDI/CRDi Injectors',
    oem: '24321-2E010',
    brand: 'HYUNDAI MOBIS GENUINE',
    originUk: 'Сеул, Південна Корея',
    originEn: 'Seoul, South Korea',
    category: 'cars-korea',
    image: IMG.perkins, // тимчасово: фото форсунок, поки немає окремого для GDI/ГРМ
    popularOems: ['24321-2E010', '24350-2E011', '24370-2E010', '35310-2E500'],
    badgeUk: 'Південна Корея',
    badgeEn: 'South Korea',
    isKoreaHub: true,
  },

  // --- КУЗОВ ТА КАБІНА (CAT CAB & CASE) ---
  {
    id: 'sub-cab-cat-door',
    nameUk: 'Двері кабіни оператора CAT у зборі (Operator Cab Door)',
    nameEn: 'CAT Operator Cab Door Complete Assembly',
    oem: '281-1196',
    brand: 'CATERPILLAR OEM',
    originUk: 'Дистрибуція ЄС / Finning UK',
    originEn: 'EU Logistics / Finning UK',
    category: 'cab',
    image: IMG.catCabDoor,
    popularOems: ['281-1196', '281-1199', '293-3116', '280-7548'],
  },
  {
    id: 'sub-cab-cat-bracket',
    nameUk: 'Центральний роликовий кронштейн дверей CAT (281-1199)',
    nameEn: 'CAT Door Center Roller Bracket Assembly',
    oem: '281-1199',
    brand: 'CATERPILLAR OEM',
    originUk: 'Дистрибуція ЄС / Finning UK',
    originEn: 'EU Logistics / Finning UK',
    category: 'cab',
    image: IMG.catDoorBracket,
    popularOems: ['281-1199', '281-1200', '281-6262', '281-6263'],
  },
  {
    id: 'sub-cab-cat-lock',
    nameUk: 'Центральний замок, ручка та фіксатор вікна кабіни CAT',
    nameEn: 'CAT Cabin Door Lock, Handle & Window Latch',
    oem: '280-7548',
    brand: 'CATERPILLAR OEM',
    originUk: 'Дистрибуція ЄС / Finning UK',
    originEn: 'EU Logistics / Finning UK',
    category: 'cab',
    image: IMG.catDoorLockHandle,
    popularOems: ['280-7548', '280-7544', '132-7625', '277-6030'],
  },
  {
    id: 'sub-cab-cat-latch',
    nameUk: 'Засувка дверей кабіни CAT з тягою (Door Latch & Rod)',
    nameEn: 'CAT Cab Door Latch with Linkage Rod',
    oem: '277-6031',
    brand: 'CATERPILLAR OEM',
    originUk: 'Дистрибуція ЄС / Finning UK',
    originEn: 'EU Logistics / Finning UK',
    category: 'cab',
    image: IMG.catDoorLatch,
    popularOems: ['277-6031', '281-3650', '196-1441', '5C-2890'],
  },
  {
    id: 'sub-cab-accuboom',
    nameUk: 'Блок контролю обприскувача Case IH AccuBoom та компресор Sanden',
    nameEn: 'Case IH AccuBoom Controller & Sanden AC Unit',
    oem: '87643472',
    brand: 'CASE IH / CNH',
    originUk: 'Базілдон, Велика Британія',
    originEn: 'Basildon, UK',
    category: 'cab',
    image: IMG.caseAccuboom,
    popularOems: ['87643472', '47773024', '83994207', '82011854'],
  },
  {
    id: 'sub-cab-sanden',
    nameUk: 'Компресор кондиціонера Sanden Case Stackcruiser',
    nameEn: 'Case Stackcruiser Sanden AC Compressor',
    oem: '47773024',
    brand: 'CASE IH / SANDEN',
    originUk: 'Дистрибуція ЄС / UK Depot',
    originEn: 'EU Logistics / UK Depot',
    category: 'cab',
    image: IMG.sandenCompressor,
    popularOems: ['47773024', '87643472', '83994207', '3234209R1'],
  },

  // --- PALL CORPORATION ---
  {
    id: 'pall-aerospace',
    nameUk: 'Pall Aerospace: Фільтрація гідросистем авіації та гелікоптерів',
    nameEn: 'Pall Aerospace: Aviation & Helicopter Hydraulic Filtration',
    oem: 'QA08982',
    brand: 'PALL AEROSPACE UK',
    originUk: 'Портсмут, Велика Британія',
    originEn: 'Portsmouth, UK',
    category: 'pall',
    image: '/parts/helicopter.webp',
    popularOems: ['QA08982', 'AC7900FKN8H', 'MC7400SKZ4H', 'AE4520Z'],
  },
  {
    id: 'pall-oilgas',
    nameUk: 'Pall Oil & Gas: Високобарічні коалесцери та газові сепаратори',
    nameEn: 'Pall Oil & Gas: High-Pressure Coalescers & Separators',
    oem: 'HC8314FKN39Z',
    brand: 'PALL INDUSTRIAL',
    originUk: 'Портсмут, Велика Британія',
    originEn: 'Portsmouth, UK',
    category: 'pall',
    image: '/parts/oil-gas-case-study-15.webp',
    popularOems: ['HC8314FKN39Z', 'CS604LGH13', 'UE619AT40Z', 'HC8904FKS16Z'],
  },
  {
    id: 'pall-membralox',
    nameUk: 'Pall Membralox: Керамічні мембранні модулі промислової очистки',
    nameEn: 'Pall Membralox: Ceramic Membrane Filtration Modules',
    oem: 'EP1940GL0.2A',
    brand: 'PALL MEMBRALOX',
    originUk: 'Дистрибуція ЄС / UK Hub',
    originEn: 'EU Logistics / UK Hub',
    category: 'pall',
    image: '/parts/membralox-gpic-image.webp',
    popularOems: ['EP1940GL0.2A', 'T1-70-MEM', 'P19-60-GL', 'S37-40-0.8'],
  },
  {
    id: 'pall-hydraulics',
    nameUk: 'Pall Ultipor / Coralon: Картриджі гідравліки високого тиску',
    nameEn: 'Pall Ultipor & Coralon: Heavy Duty Hydraulic Cartridges',
    oem: 'HC9600FKN8H',
    brand: 'PALL CORPORATION',
    originUk: 'Портсмут, Велика Британія',
    originEn: 'Portsmouth, UK',
    category: 'pall',
    image: IMG.pall,
    popularOems: ['HC9600FKN8H', 'HC8314FKN39Z', 'UE319AP20Z', 'HC2216FKS6Z'],
  },

  // --- ФІЛЬТРАЦІЯ ---
  {
    id: 'sub-filt-donaldson',
    nameUk: 'Donaldson: Twist&Drain та картриджі PowerCore',
    nameEn: 'Donaldson: Twist&Drain & PowerCore Media',
    oem: 'P558000',
    brand: 'DONALDSON FILTRATION',
    originUk: 'Левен, Бельгія',
    originEn: 'Leuven, Belgium',
    category: 'filtration',
    image: IMG.donaldson,
    popularOems: ['P558000', 'P553004', 'P535114', 'SH60187'],
  },
  {
    id: 'sub-filt-fleetguard',
    nameUk: 'Fleetguard FS1280 (Cummins 3930942) та комплекти NanoNet',
    nameEn: 'Fleetguard FS1280 Cummins Separator & NanoNet',
    oem: 'FS1280',
    brand: 'FLEETGUARD CUMMINS',
    originUk: 'Склади UK та Європи',
    originEn: 'UK & European Hubs',
    category: 'filtration',
    image: '/parts/Fleetguard.jpeg',
    popularOems: ['FS1280', '3930942', 'FS19732', 'LF16015'],
  },
  {
    id: 'sub-filt-mann',
    nameUk: 'Mann+Hummel: Повітряні та гідравлічні картриджі Europiclon',
    nameEn: 'Mann+Hummel: Europiclon Air & Hydraulic Filters',
    oem: 'C23610',
    brand: 'MANN+HUMMEL',
    originUk: 'Людвігсбург, Німеччина',
    originEn: 'Ludwigsburg, Germany',
    category: 'filtration',
    image: '/parts/Mann-Filter.jpeg',
    popularOems: ['C23610', 'W950/26', 'WD13145', 'CF1200'],
  },
  {
    id: 'sub-filt-pall',
    nameUk: 'Pall Filtration: Промислові та гідравлічні елементи тонкої очистки',
    nameEn: 'Pall Filtration: Industrial Fine Hydraulic Elements',
    oem: 'HC9600FKN8H',
    brand: 'PALL CORPORATION',
    originUk: 'Портсмут, Велика Британія',
    originEn: 'Portsmouth, UK',
    category: 'filtration',
    image: IMG.pall,
    popularOems: ['HC9600FKN8H', 'HC8314FKN39Z', 'UE319AP20Z', 'HC2216FKS6Z'],
  },

  // --- ДВИГУНИ ТА COMMON RAIL ---
  {
    id: 'sub-eng-perkins',
    nameUk: 'Perkins Engines: Форсунки Common Rail та поршні',
    nameEn: 'Perkins: CR Injectors & Liner Kits',
    oem: '2645A747',
    brand: 'PERKINS ENGINES',
    originUk: 'Пітерборо, Велика Британія',
    originEn: 'Peterborough, UK',
    category: 'engines',
    image: IMG.perkins,
    popularOems: ['2645A747', 'U5MK8267', 'T413847', '2641A203'],
  },
  {
    id: 'sub-eng-cat',
    nameUk: 'Caterpillar (CAT): Турбіни, ТНВД, форсунки C7.1 / C9 / C13',
    nameEn: 'Caterpillar: Turbochargers, Fuel Pumps & Injectors',
    oem: '387-9427',
    brand: 'CATERPILLAR OEM',
    originUk: 'Finning UK / Євросклад',
    originEn: 'Finning UK / EU Depot',
    category: 'engines',
    image: '/parts/CAT.jpeg',
    popularOems: ['387-9427', '10R-7675', '326-1644', '224-3238'],
  },
  {
    id: 'sub-eng-cummins',
    nameUk: 'Cummins Genuine: Паливна апаратура QSB6.7 / ISBe та ГБЦ',
    nameEn: 'Cummins Genuine: QSB6.7 / ISBe Fuel Systems & Heads',
    oem: '4937065',
    brand: 'CUMMINS UK',
    originUk: 'Дарлінгтон, Велика Британія',
    originEn: 'Darlington, UK',
    category: 'engines',
    image: '/parts/Cummins.jpeg',
    popularOems: ['4937065', '5263307', '4940647', '3973228'],
  },
  {
    id: 'sub-eng-deutz',
    nameUk: 'Deutz AG: Паливні насоси високого тиску та циліндро-поршневі групи',
    nameEn: 'Deutz AG: High-Pressure Injection Pumps & Liner Kits',
    oem: '04287047',
    brand: 'DEUTZ AG',
    originUk: 'Кельн, Німеччина',
    originEn: 'Cologne, Germany',
    category: 'engines',
    image: '/parts/Deutz.jpeg',
    popularOems: ['04287047', '04284142', '02937441', '04207588'],
  },

  // --- ГІДРАВЛІКА ---
  {
    id: 'sub-hyd-jcb',
    nameUk: 'JCB / Parker: Тандемні шестеренні та аксіально-поршневі насоси 3CX/4CX',
    nameEn: 'JCB / Parker: Twin Gear & Piston Pumps 3CX/4CX',
    oem: '332/Y3163',
    brand: 'JCB GENUINE / PARKER',
    originUk: 'Рочестер, Велика Британія',
    originEn: 'Rocester, UK',
    category: 'hydraulics',
    image: IMG.jcbPump,
    popularOems: ['332/Y3163', '20/925327', '333/G5390', '20/925339'],
  },
  {
    id: 'sub-hyd-rexroth',
    nameUk: 'Bosch Rexroth: Насоси A10VSO, A4VG та гідромотори ходу A2FE',
    nameEn: 'Bosch Rexroth: A10VSO, A4VG Pumps & A2FE Travel Motors',
    oem: 'A10VSO18DRG',
    brand: 'BOSCH REXROTH',
    originUk: 'Лор-ам-Майн, Німеччина',
    originEn: 'Lohr am Main, Germany',
    category: 'hydraulics',
    image: IMG.rexroth,
    popularOems: ['A10VSO18DRG', 'A10VSO71DFR1', 'A4VG90EP4D1', 'A2FE107/61W'],
  },
  {
    id: 'sub-hyd-danfoss',
    nameUk: 'Danfoss Power Solutions: Насоси-дозатори OSPB, мотори OMT / OMV та PVG32',
    nameEn: 'Danfoss: OSPB Steering Units, OMT Motors & PVG32',
    oem: 'OSPB 160 ON',
    brand: 'DANFOSS MOBILE',
    originUk: 'Норборг, Данія',
    originEn: 'Nordborg, Denmark',
    category: 'hydraulics',
    image: '/parts/Danfoss.jpg',
    popularOems: ['OSPB 160 ON', 'OSPB 200 ON', 'OMT 250', '157B4032'],
  },
  {
    id: 'sub-hyd-vickers',
    nameUk: 'Eaton Vickers: Лопатеві насоси серії V / VQ та картриджі',
    nameEn: 'Eaton Vickers: V / VQ Series Vane Pumps & Cartridges',
    oem: '35VQ38A',
    brand: 'EATON VICKERS',
    originUk: 'Гавант, Велика Британія',
    originEn: 'Havant, UK',
    category: 'hydraulics',
    image: '/parts/Eaton Vickers.jpeg',
    popularOems: ['35VQ38A', '25VQ21A', '4535V60A38', '421232'],
  },

  // --- МОСТИ ТА РЕДУКТОРИ ---
  {
    id: 'sub-und-carraro',
    nameUk: 'Carraro Drivetech: Мости в зборі, шестерні, шворні',
    nameEn: 'Carraro: Complete Axles & Differential Kits',
    oem: '149298',
    brand: 'CARRARO DRIVETECH',
    originUk: 'Камподарсего, Італія',
    originEn: 'Campodarsego, Italy',
    category: 'undercarriage',
    image: IMG.carraroAxle,
    popularOems: ['149298', '047702', '125196', '140643'],
  },
  {
    id: 'sub-und-zf',
    nameUk: 'ZF Friedrichshafen: Бортові редуктори мостів та фрикціони КПП',
    nameEn: 'ZF: Heavy Axle Reducers & Gearbox Clutches',
    oem: '0501.216.002',
    brand: 'ZF FRIEDRICHSHAFEN',
    originUk: 'Фрідріхсгафен, Німеччина',
    originEn: 'Friedrichshafen, Germany',
    category: 'undercarriage',
    image: '/parts/ZF.jpeg',
    popularOems: ['0501.216.002', '0501.322.845', '4143.040.001', '0734.319.418'],
  },
  {
    id: 'sub-und-spicer',
    nameUk: 'Dana Spicer: Кардани, диференціали, хрестовини мостів',
    nameEn: 'Dana Spicer: Cardan Shafts & Heavy Diffs',
    oem: '213.12.012.01',
    brand: 'DANA SPICER',
    originUk: 'Монселіче, Італія',
    originEn: 'Monselice, Italy',
    category: 'undercarriage',
    image: '/parts/Dana Spicer.jpeg',
    popularOems: ['213.12.012.01', '012.052.02', '212.09.045', '311.08.019'],
  },
  {
    id: 'sub-und-jcb',
    nameUk: 'JCB Undercarriage: Поворотні кулаки, редуктори та піввісі 3CX/4CX',
    nameEn: 'JCB Undercarriage: Steering Knuckles & Hubs',
    oem: '458/20403',
    brand: 'JCB PARTS UK',
    originUk: 'Рочестер, Велика Британія',
    originEn: 'Rocester, UK',
    category: 'undercarriage',
    image: '/parts/Carraro.jpg',
    popularOems: ['458/20403', '450/10206', '04/600786', '714/40526'],
  },
];

// Всі 16 артикулів повного комплекту дверей CAT
const CAT_FULL_DOOR_KIT_OEMS = [
  '281-1196',
  '281-1199',
  '293-3116',
  '280-7548',
  '196-1441',
  '280-7544',
  '132-7625',
  '277-6031',
  '281-3650',
  '277-6030',
  '281-1200',
  '280-7552',
  '281-6262',
  '281-6263',
  '281-6264',
  '5C-2890',
];

// Безпечне фото: якщо шляху немає або файл не завантажився — показуємо заглушку
function SafeImage({
  src,
  alt,
  className,
  placeholderText,
}: {
  src: string;
  alt: string;
  className?: string;
  placeholderText: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-300">
        <ImageOff className="w-10 h-10" />
        <span className="text-[11px] font-semibold text-slate-400">{placeholderText}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export default function BrandsCatalog({
  onSelectOem,
}: {
  onSelectOem: (oem: string, brandName: string) => void;
}) {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [activeTab, setActiveTab] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const placeholderText = isUk ? 'Фото готується' : 'Photo coming soon';

  const trackAndSelectOem = (oem: string, brand: string) => {
    try {
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'ViewContent', {
          content_name: oem,
          content_category: brand,
          content_ids: [oem],
          content_type: 'product',
        });
      }
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(oem).catch(() => {});
        setCopiedCode(oem);
        setTimeout(() => setCopiedCode(null), 1800);
      }
    } catch {
      // ignore
    }
    onSelectOem(oem, brand);
  };

  const selectOem = (oem: string, brand: string) => {
    trackAndSelectOem(oem, brand);
  };

  // 6 брендів тракторів
  const tractorCards = [
    {
      id: 'case-ih',
      name: 'Case IH / International',
      brand: 'CASE IH',
      defaultOem: '87643472',
      image: '/parts/case_international_puma_series.png.webp',
      badge: 'Puma, Maxxum, XL',
      descUk: 'Оригінальні блоки електроніки AccuBoom, кондиціонери Sanden, зчеплення та кабіни.',
      descEn: 'AccuBoom control units, Sanden AC compressors, clutches and cab hardware.',
      codes: ['87643472', '47773024', '83994207', '3234209R1'],
    },
    {
      id: 'ford-nh',
      name: 'Ford & New Holland',
      brand: 'NEW HOLLAND',
      defaultOem: '82011854',
      image: '/parts/ford_&_fordson_60_series.png.webp',
      badge: '60 Series, TS, TM, T6',
      descUk: 'Прямі поставки комплектуючих трансмісії, фільтрації та мостів для техніки Ford та New Holland.',
      descEn: 'Transmission, engine and hydraulic components directly from British agri hubs.',
      codes: ['82011854', '83996272', '83947477', '5165243'],
    },
    {
      id: 'massey-ferguson',
      name: 'Massey Ferguson',
      brand: 'MASSEY FERGUSON',
      defaultOem: '41312487',
      image: '/parts/Massey_Ferguson_1_1.png.webp',
      badge: 'MF 300, 5400, 6400',
      descUk: 'Вузли двигунів Perkins, водяні помпи, паливна апаратура та елементи навіски для тракторів MF.',
      descEn: 'Perkins engine parts, water pumps, fuel systems and linkages for Massey Ferguson.',
      codes: ['41312487', '3389410M1', 'U5MW0010', '3637466M91'],
    },
    {
      id: 'deutz-fahr',
      name: 'Deutz-Fahr',
      brand: 'DEUTZ-FAHR',
      defaultOem: '04284142',
      image: '/parts/deutz_agroplus_series.png.webp',
      badge: 'Agroplus, Agrotron',
      descUk: 'Оригінальні турбіни Deutz AG, гільзо-поршнева група, ремені та комплекти прокладок.',
      descEn: 'Deutz AG turbochargers, cylinder kits, filters and engine overhaul sets.',
      codes: ['04284142', '04287047', '02937441', '04207588'],
    },
    {
      id: 'renault-claas',
      name: 'Renault / CLAAS',
      brand: 'RENAULT / CLAAS',
      defaultOem: '7700034685',
      image: '/parts/renault_celtis.png.webp',
      badge: 'Celtis, Ares, Ceres',
      descUk: 'Зчеплення, гальмівні диски, деталі бортових редукторів та гідросистеми з європейських хабів.',
      descEn: 'Heavy duty clutches, brake discs, planetary parts and hydraulics from EU depots.',
      codes: ['7700034685', '6005022030', '149298', '81238'],
    },
    {
      id: 'kubota',
      name: 'Kubota Agricultural',
      brand: 'KUBOTA',
      defaultOem: '3C081-82200',
      image: '/parts/Kubota-M-Series.png.webp',
      badge: 'M-Series, ME, M9000',
      descUk: 'Гідравлічні насоси, фільтрокомплекти та вузли переднього моста для тракторів серії M.',
      descEn: 'Hydraulic gear pumps, full filter kits and front axle components for M-Series.',
      codes: ['3C081-82200', '3C081-82220', '3A111-82200', '70914'],
    },
  ];

  // Системні групи агротехніки
  const tractorSystemGroups = [
    {
      titleUk: 'Кабіна, електроніка та клімат',
      titleEn: 'Cab, Electronics & HVAC',
      icon: DoorClosed,
      items: [
        { labelUk: 'Блок Case AccuBoom (87643472)', labelEn: 'Case AccuBoom Unit (87643472)', oem: '87643472', brand: 'CASE IH' },
        { labelUk: 'Компресор Sanden (47773024)', labelEn: 'Sanden Compressor (47773024)', oem: '47773024', brand: 'CASE IH / SANDEN' },
        { labelUk: 'Скло та ущільнювачі дверей CNH', labelEn: 'CNH Door Glass & Seals', oem: '82011854', brand: 'NEW HOLLAND' },
      ],
    },
    {
      titleUk: 'Зчеплення, КПП та мости',
      titleEn: 'Clutch, Gearbox & Axles',
      icon: Cog,
      items: [
        { labelUk: 'Корзина та диск зчеплення Luk/Carraro', labelEn: 'Luk/Carraro Clutch Kit', oem: '83994207', brand: 'CASE IH' },
        { labelUk: 'Касетний сальник маточини Carraro', labelEn: 'Carraro Hub Cassette Seal', oem: '149298', brand: 'CARRARO' },
        { labelUk: 'Конічна пара переднього моста', labelEn: 'Front Axle Bevel Gear Set', oem: '047702', brand: 'CARRARO' },
      ],
    },
    {
      titleUk: 'Гідравліка та навіска',
      titleEn: 'Hydraulics & Linkage',
      icon: Gauge,
      items: [
        { labelUk: 'Шестеренний гідронасос трактора', labelEn: 'Tractor Hydraulic Gear Pump', oem: '83996272', brand: 'NEW HOLLAND' },
        { labelUk: 'Кермовий насос-дозатор Danfoss OSPB', labelEn: 'Danfoss OSPB Steering Unit', oem: 'OSPB 160 ON', brand: 'DANFOSS' },
        { labelUk: 'Гідронасос Kubota M-Series', labelEn: 'Kubota M-Series Hydraulic Pump', oem: '3C081-82200', brand: 'KUBOTA' },
      ],
    },
    {
      titleUk: 'Двигун, паливна та охолодження',
      titleEn: 'Engine, Fuel & Cooling',
      icon: Cpu,
      items: [
        { labelUk: 'Форсунка Common Rail Perkins', labelEn: 'Perkins CR Fuel Injector', oem: '2645A747', brand: 'PERKINS' },
        { labelUk: 'Водяна помпа Massey Ferguson', labelEn: 'Massey Ferguson Water Pump', oem: 'U5MW0010', brand: 'PERKINS / MF' },
        { labelUk: 'Турбокомпресор Deutz Agrotron', labelEn: 'Deutz Agrotron Turbocharger', oem: '04284142', brand: 'DEUTZ-FAHR' },
      ],
    },
  ];

  const mainTabs = [
    { id: 'all', labelUk: 'Всі ключові вузли (Топ-12)', labelEn: 'All Key Assemblies (Top 12)', icon: Layers },
    { id: 'tractors', labelUk: 'Трактори та Агро (6 марок)', labelEn: 'Tractors & Agri (6 Brands)', icon: Tractor },
    { id: 'pall', labelUk: 'Pall Corporation (Авіа / Нафта)', labelEn: 'Pall Corporation (Aero / Oil)', icon: Plane },
    { id: 'spec-korea', labelUk: 'Спецтехніка з Кореї (Hyundai)', labelEn: 'Korea Heavy Equipment (Hyundai)', icon: HardHat },
    { id: 'cars-korea', labelUk: 'Легкові авто з Кореї (Mobis)', labelEn: 'Korea Passenger Cars (Mobis)', icon: Car },
    { id: 'cab', labelUk: 'Кузов та кабіна (CAT / CNH)', labelEn: 'Cab & Body (CAT / CNH)', icon: DoorClosed },
    { id: 'suspension', labelUk: 'Амортизатори (KYB / Monroe)', labelEn: 'Shocks & Struts (KYB / Monroe)', icon: Disc },
    { id: 'filtration', labelUk: 'Фільтрація', labelEn: 'Filtration', icon: Filter },
    { id: 'engines', labelUk: 'Двигуни та CR', labelEn: 'Engines & CR', icon: Cpu },
    { id: 'hydraulics', labelUk: 'Гідравліка', labelEn: 'Hydraulics', icon: Gauge },
    { id: 'undercarriage', labelUk: 'Мости та редуктори', labelEn: 'Axles & Transmission', icon: Wrench },
  ];

  const displayedList =
    activeTab === 'all'
      ? SHOWCASE_FEATURED
      : SUBGROUP_PARTS.filter((p) => p.category === activeTab);

  return (
    <section
      id="oem-brands"
      className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Заголовок */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {isUk
              ? 'Поставки зі складів UK, ЄС та Південної Кореї • 0% UK VAT'
              : 'Direct Supply from UK, EU & South Korea Hubs • 0% UK VAT'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {isUk
              ? 'Оригінальні вузли та перевірені замінники під замовлення'
              : 'Genuine OEM & Aftermarket Assemblies on Order'}
          </h2>
          <p className="max-w-2xl mx-auto text-slate-600 text-sm sm:text-base">
            {isUk
              ? 'Оберіть напрямок або натисніть на каталожний номер деталі — він автоматично скопіюється та підставиться у форму розрахунку вартості.'
              : 'Select a category or click any OEM number to automatically copy and load it into the quote calculator.'}
          </p>
        </div>

        {/* Головні таби категорій */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
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

        {/* СПЕЦІАЛЬНИЙ БЛОК: PALL CORPORATION */}
        {activeTab === 'pall' && (
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isUk ? 'Високотехнологічна фільтрація Pall UK (Portsmouth)' : 'Pall UK High-Tech Filtration Hub'}
                </div>
                <h3 className="text-2xl font-black">
                  {isUk
                    ? 'Pall Aerospace, Oil & Gas, Membralox та промислова гідравліка'
                    : 'Pall Aerospace, Oil & Gas, Membralox & Industrial Hydraulics'}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {isUk
                    ? 'Прямі поставки оригінальних фільтроелементів Pall Ultipor, Coralon, коалесцерів для нафтогазової галузі, керамічних мембран Membralox та авіаційних картриджів із британського хабу.'
                    : 'Direct UK dispatches of genuine Pall Ultipor, Coralon, Oil & Gas coalescers, Membralox ceramic membranes and aviation filtration.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <Plane className="w-5 h-5 text-sky-400 shrink-0" />
                    <div className="text-xs">
                      <div className="font-bold text-white">Aerospace & Defense</div>
                      <div className="text-slate-400">Гідросистеми авіації</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <Factory className="w-5 h-5 text-amber-400 shrink-0" />
                    <div className="text-xs">
                      <div className="font-bold text-white">Oil, Gas & Turbine</div>
                      <div className="text-slate-400">Сепаратори високого тиску</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <Droplets className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div className="text-xs">
                      <div className="font-bold text-white">Membralox Ceramic</div>
                      <div className="text-slate-400">Керамічна мікрофільтрація</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-700/80 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {isUk ? 'Швидкий запит на серію Pall:' : 'Quick Pall Series Inquiry:'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['HC9600FKN8H', 'HC8314FKN39Z', 'UE319AP20Z', 'HC2216FKS6Z', 'EP1940GL0.2A', 'QA08982'].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => selectOem(code, 'PALL CORPORATION')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-sky-600 text-white font-mono text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>{code}</span>
                      {copiedCode === code ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 opacity-50" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* СПЕЦІАЛЬНИЙ БЛОК: ПОВНИЙ КОМПЛЕКТ ДВЕРЕЙ CATERPILLAR НА 16 НОМЕРІВ */}
        {activeTab === 'cab' && (
          <div className="rounded-3xl bg-white border-2 border-amber-400/80 p-6 sm:p-8 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
                  <DoorClosed className="w-3.5 h-3.5" />
                  {isUk ? 'Спецпропозиція: Кабіна Caterpillar (16 OEM позицій)' : 'Special Kit: Caterpillar Cab Door (16 OEM Items)'}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {isUk
                    ? 'Повний монтажний комплект дверей CAT 303C / 303.5E / 304E / 305E'
                    : 'Complete CAT 303C / 303.5E / 304E / 305E Cab Door Assembly Kit'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  {isUk
                    ? 'Замовляйте як двері в зборі (281-1196), так і будь-який окремий роликовий кронштейн, замок, тягу або фіксатор вікна зі списку нижче:'
                    : 'Order either the complete door assembly (281-1196) or any individual roller bracket, latch, rod or catch below:'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectOem(CAT_FULL_DOOR_KIT_OEMS.join(', '), 'CATERPILLAR CAB DOOR FULL KIT (16 ITEMS)')}
                className="px-5 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-sm flex items-center justify-center gap-2"
              >
                <span>{isUk ? 'Розрахувати всі 16 кодів разом' : 'Quote All 16 Codes Together'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
              {CAT_FULL_DOOR_KIT_OEMS.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => selectOem(code, 'CATERPILLAR OEM')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 font-mono text-xs font-bold transition-colors border border-slate-200 cursor-pointer flex items-center gap-1"
                >
                  <span>{code}</span>
                  {copiedCode === code ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3 opacity-40" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* СПЕЦІАЛЬНИЙ БЛОК: СПЕЦТЕХНІКА З КОРЕЇ (HYUNDAI ROBEX / DOOSAN) */}
        {activeTab === 'spec-korea' && (
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-800/50">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                  <HardHat className="w-3.5 h-3.5" />
                  {isUk ? 'Прямий експорт з Ульсана та Пусана (Південна Корея)' : 'Direct Export from Ulsan & Busan (South Korea)'}
                </div>
                <h3 className="text-xl sm:text-2xl font-black">
                  {isUk
                    ? 'Вузли екскаваторів та навантажувачів Hyundai Robex / HD Hyundai / Doosan'
                    : 'Hyundai Robex / HD Hyundai / Doosan Heavy Excavator Assemblies'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isUk
                    ? 'Головні тандемні гідронасоси Kawasaki/Flutek (31N6-10010), опорні катки (E181-2002BG), тягові зірочки (81EM-10010), редуктори ходу та оригінальні ремкомплекти гідроциліндрів стріли і ковша.'
                    : 'Main hydraulic pumps (31N6-10010), track rollers (E181-2002BG), drive sprockets (81EM-10010) and genuine boom/bucket cylinder seal kits.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectOem('31N6-10010', 'HYUNDAI HEAVY INDUSTRIES')}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-2"
              >
                <span>{isUk ? 'Запитати прайс з Кореї' : 'Request Korea Hub Quote'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* СПЕЦІАЛЬНИЙ БЛОК: ЛЕГКОВІ АВТО З КОРЕЇ (HYUNDAI / KIA / GENESIS MOBIS) */}
        {activeTab === 'cars-korea' && (
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800/50">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <Car className="w-3.5 h-3.5" />
                  {isUk ? 'Оригінал Hyundai Mobis / Mando / CTR (Сеул, Корея)' : 'Genuine Hyundai Mobis / Mando / CTR (Seoul, Korea)'}
                </div>
                <h3 className="text-xl sm:text-2xl font-black">
                  {isUk
                    ? 'Оригінальні автозапчастини Hyundai, Kia та Genesis з внутрішнього ринку Кореї'
                    : 'Genuine Hyundai, Kia & Genesis OEM Parts from Domestic Korean Hubs'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isUk
                    ? 'Електронні блоки управління двигуном (ECU), смарт-ключі, матрична та LED-оптика, деталі підвіски Mando/CTR та комплекти ГРМ із заводських складів у Сеулі та Пхьонтхеку.'
                    : 'Engine control units (ECU), smart keys, full LED headlights, Mando/CTR suspension parts and OEM timing kits directly from Seoul.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectOem('39110-2B010', 'HYUNDAI MOBIS GENUINE')}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-2"
              >
                <span>{isUk ? 'Підібрати за VIN / OEM' : 'Search by VIN / OEM'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ВІДОБРАЖЕННЯ: АБО КАРТКИ ТРАКТОРІВ, АБО СТАНДАРТНА СІТКА ВУЗЛІВ */}
        {activeTab === 'tractors' ? (
          <div className="space-y-10">
            {/* 6 карток брендів тракторів */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tractorCards.map((tractor) => (
                <div
                  key={tractor.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-5"
                >
                  <div>
                    <div className="relative h-44 w-full bg-white rounded-xl overflow-hidden flex items-center justify-center p-3 border border-slate-100 mb-4">
                      <SafeImage
                        key={tractor.image}
                        src={tractor.image}
                        alt={tractor.name}
                        placeholderText={placeholderText}
                        className="max-h-full max-w-full object-contain"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-slate-900/90 text-white text-[10px] font-bold uppercase tracking-wider">
                        {tractor.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900">{tractor.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
                      {isUk ? tractor.descUk : tractor.descEn}
                    </p>
                  </div>

                  <div>
                    <div className="space-y-1.5 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {isUk ? 'Ходові артикули для запиту ціни:' : 'Popular OEM for Quote:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tractor.codes.map((code) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => selectOem(code, tractor.brand)}
                            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 font-mono text-xs font-bold transition-colors border border-slate-200/80 cursor-pointer flex items-center gap-1"
                            title={isUk ? `Дізнатися ціну ${code}` : `Get quote for ${code}`}
                          >
                            <span>{code}</span>
                            {copiedCode === code ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 opacity-40" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => selectOem(tractor.defaultOem, tractor.brand)}
                      className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{isUk ? 'Запитати запчастини' : 'Request Parts'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Підпункти систем агротехніки */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {tractorSystemGroups.map((group, idx) => {
                const GroupIcon = group.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                        <GroupIcon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 leading-snug">
                        {isUk ? group.titleUk : group.titleEn}
                      </h4>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      {group.items.map((sub) => (
                        <button
                          key={sub.oem}
                          type="button"
                          onClick={() => selectOem(sub.oem, sub.brand)}
                          className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <span className="text-xs font-medium text-slate-700 truncate">
                            {isUk ? sub.labelUk : sub.labelEn}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-slate-900 shrink-0">
                            {sub.oem}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {displayedList.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {/* Верхній блок із фото */}
                    <div>
                      <div className="relative h-52 w-full bg-white flex items-center justify-center p-4 border-b border-slate-100 overflow-hidden">
                        <SafeImage
                          key={item.image || item.id}
                          src={item.image}
                          alt={isUk ? item.nameUk : item.nameEn}
                          placeholderText={placeholderText}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Лівий бейдж */}
                        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200 text-[10px] font-bold text-slate-700 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>
                            {item.isKoreaHub
                              ? isUk
                                ? item.badgeUk || 'Південна Корея'
                                : item.badgeEn || 'South Korea'
                              : isUk
                              ? 'Під замовлення'
                              : 'On Order'}
                          </span>
                        </div>

                        {/* Правий бейдж: 0% VAT */}
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-mono font-bold">
                          0% VAT
                        </div>
                      </div>

                      {/* Опис деталі */}
                      <div className="p-4 space-y-1.5">
                        <div className="text-[11px] text-slate-400 font-medium">
                          📍 {isUk ? item.originUk : item.originEn}
                        </div>
                        <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                          {item.brand}
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem]">
                          {isUk ? item.nameUk : item.nameEn}
                        </h3>
                      </div>
                    </div>

                    {/* Нижній блок із клікабельними OEM-кодами та кнопкою */}
                    <div className="p-4 pt-0 space-y-3">
                      <div className="space-y-1 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                          {isUk ? 'Ходові коди / OEM:' : 'Popular OEM:'}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {item.popularOems.map((code) => (
                            <button
                              key={code}
                              type="button"
                              onClick={() => selectOem(code, item.brand)}
                              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 font-mono text-[11px] font-bold transition-colors border border-slate-200/70 cursor-pointer flex items-center gap-1"
                              title={isUk ? `Запросити пропозицію ${code}` : `Get quote for ${code}`}
                            >
                              <span>{code}</span>
                              {copiedCode === code ? (
                                <Check className="w-2.5 h-2.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-2.5 h-2.5 opacity-40" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => selectOem(item.oem, item.brand)}
                        className="w-full mt-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                      >
                        <span>{isUk ? 'Дізнатися ціну' : 'Get Quote'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
