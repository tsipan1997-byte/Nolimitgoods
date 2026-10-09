'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/lib/language-context';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const brands = [
  { 
    name: 'JCB', 
    category: 'Excavators & Backhoes',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/JCB-Logo.jpg' 
  },
  { 
    name: 'Caterpillar', 
    category: 'Heavy Earthmoving & Engines',
    logo: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhHk11QfC-XRwY4S554pO3cONUJTxupi56oOfSaeNjyeThx6uxbsYG_SLEaIi_RecOHDt_GTqjNbBpabOak1H5Ti5iicgnmP9ErU0SxHF2T81MISzLEMIfvn7u7ndtbCtTJpM_qXFp367vt/s1600/caterpillar-logo.jpg' 
  },
  { 
    name: 'Komatsu', 
    category: 'Mining & Construction',
    logo: 'https://i.etsystatic.com/51118758/r/il/f08e6e/6069285333/il_fullxfull.6069285333_3j57.jpg' 
  },
  { 
    name: 'CNH', 
    category: 'Case & New Holland',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/72/CNH_Global_%28logo%29.jpg/250px-CNH_Global_%28logo%29.jpg' 
  },
  { 
    name: 'Donaldson', 
    category: 'Industrial Air & Oil Filters',
    logo: 'https://i.ytimg.com/vi/9DluxLe2tBs/mqdefault.jpg' 
  },
  { 
    name: 'Fleetguard', 
    category: 'Filtration Systems',
    logo: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi994OYmqFwSLndbzUT8splwCABlvwKlXLen0boHdpuQlogXxgvSn1H3exYJ8fuThUGoJ1tsiNBql3rAQTsG5FqOLztV089zgoWxLlLwlosNTX85LBmDqs6GbYexRO-cKbBWdbUehnNmeP6/s1600/fleetguard.jpg' 
  },
  { 
    name: 'MANN-FILTER', 
    category: 'Premium Commercial Filters',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/MANN%2BHUMMEL_Logo.svg/250px-MANN%2BHUMMEL_Logo.svg.png' 
  },
  { 
    name: 'MP Filtri', 
    category: 'Hydraulic Filtration',
    logo: '/brands/mpfiltri.png' 
  },
  { 
    name: 'Bosch Rexroth', 
    category: 'Pumps, Valves & Motors',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Bosch_Rexroth.svg' 
  },
  { 
    name: 'Parker', 
    category: 'Fluid & Hydraulic Power',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Parker_Hannifin.svg/250px-Parker_Hannifin.svg.png' 
  },
  { 
    name: 'Hydac', 
    category: 'Hydraulics & Accumulators',
    logo: '/brands/hydac.png' 
  },
  { 
    name: 'Perkins', 
    category: 'Diesel Engines & Spares',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Perkins_Engines_logo.svg/320px-Perkins_Engines_logo.svg.png' 
  },
];

export default function BrandsSection() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleSelectBrand = (brandName: string) => {
    const rfqElement = document.getElementById('rfq');
    if (rfqElement) {
      rfqElement.scrollIntoView({ behavior: 'smooth' });
    }

    // Автоматично підставляємо бренд у поле введення форми
    setTimeout(() => {
      const inputs = document.querySelectorAll('input');
      inputs.forEach((input) => {
        if (input.placeholder && input.placeholder.toLowerCase().includes('jcb')) {
          input.value = brandName;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    }, 400);
  };

  return (
    <section id="brands" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block py-1 px-3 bg-red-100 text-red-700 text-xs font-bold uppercase rounded-full tracking-wider mb-3">
            UK & European Supply Chain
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t.brands.title}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            {t.brands.subtitle} — direct OEM procurement with fast UK dispatch and worldwide freight.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              onClick={() => handleSelectBrand(brand.name)}
              className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md border border-slate-200 hover:border-red-400 transition-all duration-200 flex flex-col justify-between items-center text-center cursor-pointer min-h-[140px]"
            >
              <div className="w-full flex justify-end">
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-red-500 transition-colors" />
              </div>

              <div className="h-12 flex items-center justify-center my-2">
                {brand.logo.startsWith('http') ? (
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} spare parts`}
                    width={110}
                    height={45}
                    className="max-h-10 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-200"
                    unoptimized
                  />
                ) : (
                  <span className="text-base font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                    {brand.name}
                  </span>
                )}
              </div>

              <div className="mt-2 w-full">
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  {brand.category}
                </p>
                <span className="text-[10px] text-red-600 font-semibold group-hover:underline mt-0.5 block">
                  Quote {brand.name} &rarr;
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
