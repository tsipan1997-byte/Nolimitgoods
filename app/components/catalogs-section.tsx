'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cog, Filter, ExternalLink, Wrench } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/lib/language-context';

interface CatalogBrand {
  name: string;
  badge: string;
  bgGradient: string;
  textColor: string;
  url: string;
  logoUrl?: string;
  imageUrl?: string;
}

const equipmentCatalogs: CatalogBrand[] = [
  {
    name: 'JCB',
    badge: 'JCB',
    bgGradient: 'from-amber-400 to-yellow-500',
    textColor: 'text-black',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/JCB-Logo.jpg/320px-JCB-Logo.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1579535313495-2637207604f7?auto=format&fit=crop&w=600&q=80', // Екскаватор JCB на об'єкті
    url: 'https://www.jcb.com/en-gb/parts',
  },
  {
    name: 'Komatsu',
    badge: 'KOMATSU',
    bgGradient: 'from-blue-600 to-blue-800',
    textColor: 'text-white',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Komatsu_company_logos.svg/320px-Komatsu_company_logos.svg.png',
    imageUrl: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&w=600&q=80', // Важка кар'єрна техніка Komatsu
    url: 'https://www.komatsu.eu/en/parts-service',
  },
  {
    name: 'Caterpillar (CAT)',
    badge: 'CAT',
    bgGradient: 'from-yellow-400 to-amber-500',
    textColor: 'text-black',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Caterpillar_logo.svg/320px-Caterpillar_logo.svg.png',
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=600&q=80', // Бульдозер CAT у роботі
    url: 'https://parts.cat.com/',
  },
];

const filterBrands = [
  {
    name: 'Donaldson',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Donaldson_Company_logo.svg/320px-Donaldson_Company_logo.svg.png',
    url: 'https://www.donaldson.com/en-us/',
    description: { en: 'Industrial filtration solutions', uk: 'Промислові фільтраційні рішення' },
  },
  {
    name: 'MANN-FILTER',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Mann%2BHummel_Logo.svg/320px-Mann%2BHummel_Logo.svg.png',
    url: 'https://www.mann-filter.com/en/homepage.html',
    description: { en: 'Automotive & industrial filters', uk: 'Автомобільні та промислові фільтри' },
  },
  {
    name: 'Fleetguard',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Cummins_Inc._logo.svg/320px-Cummins_Inc._logo.svg.png', // Fleetguard належить Cummins
    url: 'https://www.fleetguard.com/',
    description: { en: 'Heavy-duty filtration', uk: 'Фільтри для важкої техніки' },
  },
  {
    name: 'Parker Racor',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Parker_Hannifin_logo.svg/320px-Parker_Hannifin_logo.svg.png',
    url: 'https://www.parker.com/us/en/divisions/racor-division.html',
    description: { en: 'Fuel & air filtration', uk: 'Паливні та повітряні фільтри' },
  },
  {
    name: 'Baldwin',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Parker_Hannifin_logo_2012.svg/320px-Parker_Hannifin_logo_2012.svg.png', // Baldwin входить в Parker
    url: 'https://www.baldwinfilter.com/',
    description: { en: 'Quality replacement filters', uk: 'Якісні змінні фільтри' },
  },
];

function CatalogImage({ brand }: { brand: CatalogBrand }) {
  const [imgError, setImgError] = useState(false);

  if (imgError || !brand.imageUrl) {
    return (
      <div className={`w-full h-48 rounded-t-xl bg-gradient-to-br ${brand.bgGradient} flex items-center justify-center font-black text-2xl ${brand.textColor}`}>
        {brand.badge}
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-t-xl bg-slate-100">
      <img
        src={brand.imageUrl}
        alt={brand.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={() => setImgError(true)}
        loading="lazy"
      />
      {brand.logoUrl && (
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg shadow-md border border-slate-100 max-h-10 max-w-[100px] flex items-center justify-center">
          <img src={brand.logoUrl} alt={`${brand.name} logo`} className="max-h-7 object-contain" />
        </div>
      )}
    </div>
  );
}

function FilterLogo({ brand }: { brand: any }) {
  const [logoError, setLogoError] = useState(false);

  if (logoError || !brand.logoUrl) {
    return (
      <div className="w-full h-12 flex items-center justify-center font-bold text-sm text-slate-800 bg-slate-50 border border-slate-100 rounded-lg">
        {brand.name}
      </div>
    );
  }

  return (
    <div className="relative h-12 w-full bg-slate-50 rounded-lg p-2 flex items-center justify-center border border-slate-100 overflow-hidden mb-3">
      <img
        src={brand.logoUrl}
        alt={brand.name}
        onError={() => setLogoError(true)}
        className="max-h-8 max-w-[120px] object-contain grayscale hover:grayscale-0 transition-all duration-300"
        loading="lazy"
      />
    </div>
  );
}

export default function CatalogsSection() {
  const { language } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const content = {
    en: {
      title: 'Spare Parts & Catalogs',
      subtitle: 'We supply large volumes of spare parts for various heavy equipment',
      partsTitle: 'What We Supply',
      partsDescription:
        'No Limit Goods Ltd specializes in supplying large volumes of spare parts for construction and agricultural equipment. We work directly with manufacturers and authorized dealers to ensure quality and competitive prices.',
      partsFeatures: [
        'Engine parts & components',
        'Hydraulic systems & pumps',
        'Transmission parts',
        'Undercarriage components',
        'Electrical systems',
        'Cabin parts & accessories',
      ],
      equipmentTitle: 'Equipment Catalogs',
      equipmentSubtitle: 'Browse official parts catalogs from leading manufacturers',
      filtersTitle: 'Filter Catalogs',
      filtersSubtitle: 'Top filter brands we work with',
      viewCatalog: 'View Catalog',
    },
    uk: {
      title: 'Запчастини та Каталоги',
      subtitle: 'Ми постачаємо великі обсяги запчастин для різної техніки',
      partsTitle: 'Що ми постачаємо',
      partsDescription:
        'No Limit Goods Ltd спеціалізується на постачанні великих обсягів запчастин для будівельної та сільськогосподарської техніки. Ми працюємо напряму з виробниками та авторизованими дилерами для забезпечення якості та конкурентних цін.',
      partsFeatures: [
        'Запчастини двигуна',
        'Гідравлічні системи та насоси',
        'Запчастини трансмісії',
        'Ходова частина',
        'Електричні системи',
        'Запчастини кабіни та аксесуари',
      ],
      equipmentTitle: 'Каталоги техніки',
      equipmentSubtitle: 'Офіційні каталоги запчастин від провідних виробників',
      filtersTitle: 'Каталоги фільтрів',
      filtersSubtitle: 'Топ бренди фільтрів, з якими ми працюємо',
      viewCatalog: 'Переглянути каталог',
    },
  };

  const c = content[language] || content.en;

  return (
    <section id="catalogs" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{c.title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{c.subtitle}</p>
        </motion.div>

        {/* What We Supply */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-12 border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <Cog className="w-7 h-7 text-red-600 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{c.partsTitle}</h3>
            </div>
          </div>
          <p className="text-slate-600 mb-6 leading-relaxed text-sm sm:text-base">{c.partsDescription}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
            {c.partsFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100/50">
                <Wrench className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-gray-750 font-medium text-xs sm:text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Equipment Catalogs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{c.equipmentTitle}</h3>
          <p className="text-gray-600 mb-8 text-center text-sm">{c.equipmentSubtitle}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {equipmentCatalogs.map((catalog, index) => (
              <motion.a
                key={catalog.name}
                href={catalog.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl hover:border-red-200 transition-all group border border-gray-100 flex flex-col justify-between overflow-hidden"
              >
                <CatalogImage brand={catalog} />
                <div className="p-6 flex items-center justify-between border-t border-gray-100">
                  <div>
                    <span className="font-bold text-gray-900 block text-base">{catalog.name}</span>
                    <span className="text-xs text-slate-450">Офіційна специфікація та підбір</span>
                  </div>
                  <span className="text-xs font-bold text-red-600 group-hover:translate-x-1 transition-transform inline-flex items-center bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg gap-1.5 cursor-pointer">
                    <span>{c.viewCatalog}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-red-500" />
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Filter Catalogs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Filter className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">{c.filtersTitle}</h3>
          </div>
          <p className="text-gray-650 mb-8 text-center text-sm">{c.filtersSubtitle}</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {filterBrands.map((brand, index) => (
              <motion.a
                key={brand.name}
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center group border border-gray-100 hover:border-blue-200 flex flex-col justify-between"
              >
                <div>
                  <FilterLogo brand={brand} />
                  <h4 className="font-bold text-sm text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {brand.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {brand.description[language] || brand.description.en}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
