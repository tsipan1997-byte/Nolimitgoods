'use client';

import React from 'react';
import { Truck, CheckCircle, PackageCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function DeliveriesSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk';

  // Замініть ці ID на реальні ідентифікатори з ваших посилань на YouTube:
  // Наприклад, якщо посилання youtube.com/shorts/AbCdEf123, то id: "AbCdEf123"
  const videos = [
    {
      id: 'AbCdEf12345',
      title: isUk ? 'Розвантаження палет Donaldson' : 'Donaldson Pallets Unloading',
      subtitle: isUk ? 'Пряма поставка з Англії в Україну' : 'Direct shipment from the UK',
      icon: PackageCheck,
    },
    {
      id: 'GhIjKl67890',
      title: isUk ? 'Митне оформлення вантажу' : 'Customs Cleared Shipment',
      subtitle: isUk ? 'Пломби, маркування UK та цілісність пакування' : 'Customs clearance & UK markings',
      icon: CheckCircle,
    },
    {
      id: 'MnOpQr11223',
      title: isUk ? 'Партія 3 палети для клієнта' : 'Batch Delivery for Client',
      subtitle: isUk ? 'Оригінальні фільтри Donaldson зі складу' : 'Genuine Donaldson filtration stock',
      icon: Truck,
    },
  ];

  return (
    <section id="deliveries" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Заголовок секції */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 text-red-400 text-sm font-semibold mb-4 border border-red-500/30">
            <Truck className="w-4 h-4" />
            <span>{isUk ? 'Реальні поставки з Англії' : 'Real Shipments from the UK'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            {isUk ? 'Відео розвантаження та поставок' : 'Videos of Deliveries & Shipments'}
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            {isUk
              ? 'Живе підтвердження нашої роботи: оригінальні фільтри Donaldson, спецпалети з маркуванням UK та розвантаження на складі в Україні.'
              : 'Real proof of work: genuine Donaldson filters, UK marked pallets and direct deliveries.'}
          </p>
        </div>

        {/* Відео-сітка під формат Shorts (вертикальний 9:16) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {videos.map((vid, idx) => {
            const Icon = vid.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl flex flex-col"
              >
                <div className="relative w-full aspect-[9/16] bg-black">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${vid.id}`}
                    title={vid.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                      <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{vid.title}</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {vid.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
