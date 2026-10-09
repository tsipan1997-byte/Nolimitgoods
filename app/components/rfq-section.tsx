'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Send, FileText, CheckCircle, MessageSquare, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function RFQSection() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({
    partNumber: '',
    machineModel: '',
    quantity: '1',
    country: 'Україна',
    contact: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [calculation, setCalculation] = useState<{
    unitPrice: number;
    total: number;
    part: string;
    qty: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setCalculation({
          unitPrice: data.estimatedPrice || 0,
          total: data.totalEstimate || 0,
          part: formData.partNumber,
          qty: formData.quantity,
        });
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const getUahTotal = () => {
    if (!calculation) return '0';
    return Math.round(Number(calculation.total) * 56).toLocaleString('uk-UA');
  };

  const getUahUnit = () => {
    if (!calculation) return '0';
    return Math.round(Number(calculation.unitPrice) * 56).toLocaleString('uk-UA');
  };

  const getWhatsAppLink = () => {
    if (!calculation) return 'https://wa.me/380501400245';
    const text = `Доброго дня! Хочу замовити деталь ${calculation.part} (${calculation.qty} шт). Орієнтовний розрахунок: ~£${calculation.total} (≈ ${getUahTotal()} грн).`;
    return `https://wa.me/380501400245?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="rfq" className="py-20 bg-gradient-to-br from-red-600 to-red-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.rfq.title}
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Миттєвий онлайн-розрахунок вартості та пряме постачання запчастин з Британії та Європи
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-2xl text-slate-900"
        >
          {status === 'success' && calculation ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Орієнтовну вартість розраховано!
              </h3>
              <p className="text-slate-600 mb-6">
                Орієнтовна ринкова вартість для деталі <strong>{calculation.part}</strong>
              </p>

              <div className="bg-slate-50 border-2 border-red-100 rounded-xl p-6 max-w-md mx-auto mb-8 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Загальна орієнтовна вартість (з доставкою)
                </div>

                <div className="text-4xl font-black text-red-600 tracking-tight my-1">
                  ~£{calculation.total}
                </div>

                <div className="text-xl font-bold text-slate-800 mb-2">
                  ≈ {getUahTotal()} грн
                </div>

                <div className="text-sm font-medium text-slate-600 pt-2 border-t border-slate-200">
                  Близько £{calculation.unitPrice} (≈ {getUahUnit()} грн) / шт ({calculation.qty} шт)
                </div>

                <div className="inline-block mt-3 px-3 py-1 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800 font-medium">
                  Оплата: Revolut Pay, IBAN або картка (курс Revolut ~56 грн/£)
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  * Фінальний рахунок узгоджується та перевіряється менеджером перед оплатою.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-lg shadow-md transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  Підтвердити замовлення у WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle');
                    setCalculation(null);
                    setFormData({ partNumber: '', machineModel: '', quantity: '1', country: 'Україна', contact: '' });
                  }}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 px-6 rounded-lg transition-colors cursor-pointer"
                >
                  Розрахувати іншу деталь
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Каталожний номер деталі (Part Number) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.partNumber}
                    onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="наприклад: P553004 або 32/925950"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Модель техніки або Бренд *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.machineModel}
                    onChange={(e) => setFormData({ ...formData, machineModel: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-
