'use client';

import React, { useState } from 'react';
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
    if (!calculation) return 'https://wa.me/447426826595';
    const msg = `Доброго дня! Хочу замовити деталь ${calculation.part} (${calculation.qty} шт). Розрахунок: ~£${calculation.total} (≈ ${getUahTotal()} грн).`;
    return `https://wa.me/447426826595?text=${encodeURIComponent(msg)}`;
  };

  const getViberLink = () => {
    return 'viber://chat?number=%2B447426826595';
  };

  const getTelegramLink = () => {
    return 'https://t.me/+447426826595';
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
            {t.rfq.subtitle}
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

              <div className="space-y-4 max-w-md mx-auto">
                <p className="text-sm font-bold text-slate-800">
                  Оберіть зручний месенджер для підтвердження або запитання:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a
                    href={getViberLink()}
                    className="flex items-center justify-center gap-2 bg-[#7360f2] hover:bg-[#604ec9] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm cursor-pointer"
                  >
                    <span>🟣</span>
                    <span>Viber</span>
                  </a>

                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={getTelegramLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#229ED9] hover:bg-[#1d87b9] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm cursor-pointer"
                  >
                    <span>🔵</span>
                    <span>Telegram</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle');
                    setCalculation(null);
                    setFormData({ partNumber: '', machineModel: '', quantity: '1', country: 'Україна', contact: '' });
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-colors cursor-pointer text-sm mt-3"
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
                    {t.rfq.form.partNumber} *
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
                    {t.rfq.form.machineModel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.machineModel}
                    onChange={(e) => setFormData({ ...formData, machineModel: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="наприклад: JCB 3CX / Donaldson / CAT"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t.rfq.form.quantity} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t.rfq.form.country} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="Україна"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t.rfq.form.contact} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  placeholder="+380... або email@domain.com"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 text-lg disabled:opacity-70 shadow-lg cursor-pointer"
              >
                {status === 'sending' ? (
                  <span>{t.rfq.form.sending}</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t.rfq.form.submit}</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>

              {status === 'error' && (
                <p className="mt-4 text-red-600 text-center font-semibold">
                  {t.rfq.form.error}
                </p>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
