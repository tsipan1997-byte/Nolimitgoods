'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/lib/language-context';
import Image from 'next/image';

const brands = [
  { name: 'JCB', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/JCB-Logo.jpg' },
  { name: 'Caterpillar', logo: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhHk11QfC-XRwY4S554pO3cONUJTxupi56oOfSaeNjyeThx6uxbsYG_SLEaIi_RecOHDt_GTqjNbBpabOak1H5Ti5iicgnmP9ErU0SxHF2T81MISzLEMIfvn7u7ndtbCtTJpM_qXFp367vt/s1600/caterpillar-logo.jpg' },
  { name: 'Komatsu', logo: 'https://i.etsystatic.com/51118758/r/il/f08e6e/6069285333/il_fullxfull.6069285333_3j57.jpg' },
  { name: 'CNH', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/72/CNH_Global_%28logo%29.jpg/250px-CNH_Global_%28logo%29.jpg' },
  { name: 'Donaldson', logo: 'https://i.ytimg.com/vi/9DluxLe2tBs/mqdefault.jpg' },
  { name: 'Fleetguard', logo: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi994OYmqFwSLndbzUT8splwCABlvwKlXLen0boHdpuQlogXxgvSn1H3exYJ8fuThUGoJ1tsiNBql3rAQTsG5FqOLztV089zgoWxLlLwlosNTX85LBmDqs6GbYexRO-cKbBWdbUehnNmeP6/s1600/fleetguard.jpg' },
  { name: 'MANN-FILTER', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/MANN%2BHUMMEL_Logo.svg/250px-MANN%2BHUMMEL_Logo.svg.png' },
  { name: 'MP Filtri', logo: '/brands/mpfiltri.png' },
  { name: 'Bosch Rexroth', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Bosch_Rexroth.svg' },
  { name: 'Parker', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Parker_Hannifin.svg/250px-Parker_Hannifin.svg.png' },
  { name: 'Hydac', logo: '/brands/hydac.png' },
];

export default function BrandsSection() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="brands" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.brands.title}
          </h2>
          <p className="text-xl text-gray-600">
            {t.brands.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
        >
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center min-h-[100px] border border-gray-100"
            >
              {brand.logo.startsWith('http') ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={120}
                  height={50}
                  className="max-h-12 w-auto object-contain"
                  unoptimized
                />
              ) : (
                <span className="text-lg font-bold text-gray-700">{brand.name}</span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
