'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plane, ShieldCheck, CreditCard, Clock, Globe2, FileCheck } from 'lucide-react';

const guarantees = [
  {
    icon: Plane,
    title: 'Express Air & Road Freight',
    desc: 'Daily dispatches from UK warehouses. Delivery to Ukraine & EU within 3–7 business days with end-to-end tracking.',
  },
  {
    icon: ShieldCheck,
    title: '100% Genuine & Certified OEM',
    desc: 'Direct sourcing from official distributors in the UK & Germany. Factory warranties and batch certificates included.',
  },
  {
    icon: CreditCard,
    title: 'B2B Invoicing & Safe Payment',
    desc: 'Official UK Company invoices (GBP, EUR, USD). Bank wire transfers, corporate cards, and commercial contracts.',
  },
  {
    icon: Clock,
    title: 'Rapid RFQ Response',
    desc: 'Automated pricing in seconds, verified by dedicated procurement managers within 15 minutes during business hours.',
  },
  {
    icon: FileCheck,
    title: 'Customs & Export Handling',
    desc: 'Full export documentation, EUR.1 / invoice declaration support, hassle-free customs clearance assistance.',
  },
  {
    icon: Globe2,
    title: 'Hard-to-Find & Discontinued Parts',
    desc: 'Access to European dealer backorders and specialized inventories for vintage or rare machinery models.',
  },
];

export default function TrustSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 bg-red-600/20 text-red-400 text-xs font-bold uppercase rounded-full tracking-wider mb-3 border border-red-500/30">
            Why Choose NoLimitGoods
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Reliable Procurement Directly From Great Britain
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto">
            We bridge the gap between heavy industry operators and UK manufacturers with transparent terms and priority logistics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guarantees.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/60 transition-all duration-300 shadow-md group"
              >
                <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
