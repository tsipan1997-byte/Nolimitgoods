'use client';

import { useLanguage } from '@/lib/language-context';

export default function HeroSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk';

  return (
    <section className="bg-slate-900 text-white py-16">
      {/* Бейдж */}
      <div className="text-center mb-4">
        <span className="text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full border border-red-500/30 text-red-400 bg-red-600/10">
          {isUk ? 'Прямі склади у Великобританії та Європі' : 'Direct UK & European Warehouses'}
        </span>
      </div>

      {/* Головний заголовок */}
      <h1 className="text-3xl md:text-5xl font-black text-center mb-4">
        {isUk ? 'Категорії запчастин для спецтехніки' : 'Heavy Machinery Spare Parts Categories'}
      </h1>

      {/* Підзаголовок */}
      <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
        {isUk
          ? 'Оберіть категорію для швидкого розрахунку вартості та експрес-доставки з Великобританії.'
          : 'Select a category below to instantly estimate procurement and express delivery from the UK.'}
      </p>

      {/* Картки деталей */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {/* Картка 1: Фільтри */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-2">
            {isUk ? 'Фільтрація та рідини' : 'Filtration & Fluids'}
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            {isUk
              ? 'Повітряні, масляні, паливні та гідравлічні фільтри (Donaldson, Fleetguard, MANN). Комплекти ТО.'
              : 'Air, oil, fuel and hydraulic filters (Donaldson, Fleetguard, MANN). Complete service kits.'}
          </p>
          <a href="#rfq" className="text-red-400 text-sm font-semibold hover:underline">
            {isUk ? 'Миттєвий розрахунок RFQ →' : 'Instant RFQ Estimation →'}
          </a>
        </div>

        {/* Картка 2: Гідравліка */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-2">
            {isUk ? 'Гідравлічні насоси та клапани' : 'Hydraulic Pumps & Valves'}
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            {isUk
              ? 'Головні насоси, розподільники, циліндри, ремкомплекти (Rexroth, Parker, Kawasaki, Danfoss).'
              : 'Main pumps, control valves, cylinders, seal kits (Rexroth, Parker, Kawasaki, Danfoss).'}
          </p>
          <a href="#rfq" className="text-red-400 text-sm font-semibold hover:underline">
            {isUk ? 'Миттєвий розрахунок RFQ →' : 'Instant RFQ Estimation →'}
          </a>
        </div>

        {/* Картка 3: Двигун */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-2">
            {isUk ? 'Двигуни та турбосистеми' : 'Engine & Turbo Systems'}
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            {isUk
              ? 'Поршні, гільзи, прокладки, турбокомпресори, форсунки (Perkins, Cummins, CAT, Deutz).'
              : 'Pistons, liners, gasket sets, turbochargers, injectors (Perkins, Cummins, CAT, Deutz).'}
          </p>
          <a href="#rfq" className="text-red-400 text-sm font-semibold hover:underline">
            {isUk ? 'Миттєвий розрахунок RFQ →' : 'Instant RFQ Estimation →'}
          </a>
        </div>
      </div>
    </section>
  );
}
