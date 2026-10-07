'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/lib/language-context';
import { Filter, Fuel, Settings, Droplets, Cog, Thermometer, Zap, Truck } from 'lucide-react';

const icons = [Filter, Fuel, Settings, Droplets, Cog, Thermometer, Zap, Truck];

export default function PartsSection() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="parts" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.partsSupply.title}
          </h2>
          <p className="text-xl text-gray-600">
            {t.partsSupply.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {t.partsSupply.items.map((item: string, index: number) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 hover:bg-red-50 hover:border-red-200 border-2 border-transparent transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <Icon className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="font-semibold text-gray-800 group-hover:text-red-700 transition-colors">
                    {item}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
