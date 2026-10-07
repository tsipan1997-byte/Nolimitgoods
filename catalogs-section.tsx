'use client';

import { motion } from 'framer-motion';
import { Cog, Filter, ExternalLink, Truck, Wrench, Settings } from 'lucide-react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/lib/language-context';

const equipmentCatalogs = [
  {
    name: 'JCB',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/JCB-Logo.jpg',
    url: 'https://www.jcb.com/en-gb/parts',
    color: 'bg-yellow-500',
  },
  {
    name: 'Komatsu',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Komatsu_company_logos.svg/1280px-Komatsu_company_logos.svg.png',
    url: 'https://www.komatsu.eu/en/parts-service',
    color: 'bg-blue-600',
  },
  {
    name: 'Caterpillar',
    logo: 'https://i.pinimg.com/474x/da/e8/fb/dae8fb82aa3b9772f29c9be2c4fdcbd1.jpg',
    url: 'https://parts.cat.com/',
    color: 'bg-yellow-400',
  },
];

const filterBrands = [
  {
    name: 'Donaldson',
    url: 'https://www.donaldson.com/en-us/',
    description: { en: 'Industrial filtration solutions', uk: 'Промислові фільтраційні рішення' },
  },
  {
    name: 'MANN-FILTER',
    url: 'https://www.mann-filter.com/en/homepage.html',
    description: { en: 'Automotive & industrial filters', uk: 'Автомобільні та промислові фільтри' },
  },
  {
    name: 'Fleetguard',
    url: 'https://www.fleetguard.com/',
    description: { en: 'Heavy-duty filtration', uk: 'Фільтри для важкої техніки' },
  },
  {
    name: 'Parker Racor',
    url: 'https://www.parker.com/us/en/divisions/racor-division.html',
    description: { en: 'Fuel & air filtration', uk: 'Паливні та повітряні фільтри' },
  },
  {
    name: 'Baldwin',
    url: 'https://www.baldwinfilter.com/',
    description: { en: 'Quality replacement filters', uk: 'Якісні змінні фільтри' },
  },
];

export default function CatalogsSection() {
  const { language, t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const content = {
    en: {
      title: 'Spare Parts & Catalogs',
      subtitle: 'We supply large volumes of spare parts for various heavy equipment',
      partsTitle: 'What We Supply',
      partsDescription: 'No Limit Goods Ltd specializes in supplying large volumes of spare parts for construction and agricultural equipment. We work directly with manufacturers and authorized dealers to ensure quality and competitive prices.',
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
      partsDescription: 'No Limit Goods Ltd спеціалізується на постачанні великих обсягів запчастин для будівельної та сільськогосподарської техніки. Ми працюємо напряму з виробниками та авторизованими дилерами для забезпечення якості та конкурентних цін.',
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
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {c.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {c.subtitle}
          </p>
        </motion.div>

        {/* What We Supply */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <Cog className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{c.partsTitle}</h3>
            </div>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {c.partsDescription}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {c.partsFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{feature}</span>
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
          <p className="text-gray-600 mb-8 text-center">{c.equipmentSubtitle}</p>
          
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
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all group border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="relative h-12 w-32 bg-gray-50 rounded-lg p-2">
                    <Image
                      src={catalog.logo}
                      alt={catalog.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{catalog.name}</span>
                  <span className="text-sm text-red-600 group-hover:underline">{c.viewCatalog} →</span>
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
          <p className="text-gray-600 mb-8 text-center">{c.filtersSubtitle}</p>
          
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
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center group border border-gray-100 hover:border-blue-200"
              >
                <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {brand.name}
                </h4>
                <p className="text-xs text-gray-500">
                  {brand.description[language] || brand.description.en}
                </p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
