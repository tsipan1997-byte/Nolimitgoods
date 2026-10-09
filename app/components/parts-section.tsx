'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Filter, 
  Cpu, 
  Wrench, 
  Truck, 
  Gauge, 
  Disc, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function PartsSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const categories = [
    {
      icon: Filter,
      title: isUk ? 'Фільтрація та рідини' : 'Filtration & Fluids',
      desc: isUk
        ? 'Повітряні, масляні, паливні та гідравлічні фільтри (Donaldson, Fleetguard, MANN). Комплекти ТО.'
        : 'Air, oil, fuel and hydraulic filters (Donaldson, Fleetguard, MANN). Complete service kits.',
      popular: 'Donaldson P553004, Baldwin, MANN',
      preset: isUk ? 'Комплект фільтрів (масло/повітря/паливо)' : 'Filtration Kit (Oil/Air/Fuel)'
    },
    {
      icon: Gauge,
      title: isUk ? 'Гідравлічні насоси та клапани' : 'Hydraulic Pumps & Valves',
      desc: isUk
        ? 'Головні насоси, гідророзподільники, циліндри, ремкомплекти сальників (Rexroth, Parker, Kawasaki, Danfoss).'
        : 'Main pumps, control valves, cylinders, seal kits (Rexroth, Parker, Kawasaki, Danfoss).',
      popular: 'Bosch Rexroth A10VSO, Parker PV',
      preset: isUk ? 'Гідравлічний насос / циліндр' : 'Hydraulic Main Pump / Cylinder'
    },
    {
      icon: Wrench,
      title: isUk ? 'Двигуни та турбосистеми' : 'Engine & Turbo Systems',
      desc: isUk
        ? 'Поршні, гільзи, комплекти прокладок, турбокомпресори, форсунки (Perkins, Cummins, CAT, Deutz).'
        : 'Pistons, liners, gasket sets, turbochargers, injectors (Perkins, Cummins, CAT, Deutz).',
      popular: 'Perkins 1104, Cummins QSB, CAT C-Series',
      preset: isUk ? 'Ремкомплект двигуна / форсунки' : 'Engine Overhaul Kit / Injectors'
    },
    {
      icon: Disc,
      title: isUk ? 'Ходова частина та гусениці' : 'Undercarriage & Tracks',
      desc: isUk
        ? 'Гумові та сталеві гусениці, опорні та підтримуючі котки, лінивці, зірочки для міні- та важких екскаваторів.'
        : 'Rubber tracks, steel track chains, rollers, idlers, sprockets for mini & heavy excavators.',
      popular: 'JCB JS series, CAT 320, Komatsu PC',
      preset: isUk ? 'Гумові гусениці / опорні котки' : 'Rubber Tracks / Track Rollers'
    },
    {
      icon: Truck,
      title: isUk ? 'Трансмісія та мости' : 'Transmission & Axles',
      desc: isUk
        ? 'Елементи трансмісії, планетарні передачі, фрикційні диски, диференціали (Carraro, Dana, ZF).'
        : 'Driveline components, planetary gears, friction plates, differentials (Carraro, Dana, ZF).',
      popular: 'Dana Spicer, Carraro 28.32, ZF Powershift',
      preset: isUk ? 'Шестерні КПП / запчастини моста' : 'Transmission Gears / Axle Spares'
    },
    {
      icon: Cpu,
      title: isUk ? 'Електрика та датчики' : 'Electrical & Sensors',
      desc: isUk
        ? 'Стартери, генератори, блоки управління (ECU), джгути проводки, датчики тиску та температури.'
        : 'Starters, alternators, controllers (ECU), wiring harnesses, pressure & temp sensors.',
      popular: 'Denso, Bosch, Delco Remy 24V',
      preset: isUk ? 'Стартер / генератор / датчик' : 'Starter / Alternator / Sensor'
    },
  ];

  const handleSelectCategory = (presetText: string) => {
    const rfqElement = document.getElementById('rfq');
    if (rfqElement) {
      rfqElement.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      const inputs = document.querySelectorAll('input');
      inputs.forEach((input) => {
        if (input.placeholder && input.placeholder.toLowerCase().includes('p553004')) {
          input.value = presetText;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    }, 400);
  };

  return (
    <section id="parts" className="py-20 bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-red-600/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-4 border border-red-500/30">
            <ShieldCheck className="w-4 h-4" />{' '}
            {isUk ? 'Прямі склади у Великобританії та Європі' : 'Direct UK & European Warehouses'}
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            {isUk ? 'Категорії запчастин для спецтехніки' : 'Heavy Machinery Spare Parts Categories'}
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto">
            {isUk
              ? 'Оберіть категорію нижче для миттєвого розрахунку вартості та експрес-доставки з Великобританії.'
              : 'Select a category below to instantly estimate procurement and express delivery from the UK.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => handleSelectCategory(cat.preset)}
                className="group relative bg-slate-800/80 hover:bg-slate-800 rounded-2xl p-7 border border-slate-700/80 hover:border-red-500/80 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-red-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-700/60 mt-2">
                  <div className="text-xs text-slate-500 mb-2 truncate">
                    <span className="text-slate-400 font-semibold">{isUk ? 'Популярні:' : 'Common:'}</span>{' '}
                    {cat.popular}
                  </div>
                  <div className="flex items-center text-sm font-semibold text-red-400 group-hover:text-red-300">
                    <span>{isUk ? 'Миттєвий розрахунок RFQ' : 'Instant RFQ Estimation'}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
