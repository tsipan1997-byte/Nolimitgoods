'use client';

import React, { useState } from 'react';
import Header from './components/header';
import DeliveriesSection from './components/deliveries-section';
import ContactSection from './components/contact-section';
import Footer from './components/footer';
import FloatingContact from './components/floating-contact';
import { motion, AnimatePresence } from 'framer-motion';
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
  Truck,
  Activity,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

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
  image: string;
  popularOems: string[];
  badgeUk?: string;
  badgeEn?: string;
  isKoreaHub?: boolean;
}

// 1. ГОЛОВНА ВІТРИНА (ТОП-11 КЛЮЧОВИХ ПОЗИЦІЙ)
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
    image: '/parts/JCB-Parker.jpg',
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
    image: '/parts/Gemini_Generated_Image_5hp4r05hp4r05hp4.jpg',
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
    image: '/parts/General-Industrial.jpg',
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
    image: '/parts/images.jpeg',
    popularOems: ['281-1196', '281-1199', '293-3116', '280-7548'],
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
    id: 'donaldson-filter',
    nameUk: 'Фільтр-сепаратор Donaldson Twist&Drain',
    nameEn: 'Donaldson Twist&Drain Fuel Separator',
    oem: 'P558000',
    brand: 'DONALDSON FILTRATION',
    originUk: 'Левен, Бельгія',
    originEn: 'Leuven, Belgium',
    category: 'filtration',
    image: '/parts/Donaldson.jpeg',
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
    image: '/parts/Pall.jpeg',
    popularOems: ['HC9600FKN8H', 'HC8314FKN39Z', 'UE319AP20Z', 'HC2216FKS6Z'],
  },
  {
    id: 'kyb
