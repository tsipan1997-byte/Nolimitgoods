'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Send, FileText, CheckCircle, MessageSquare, ArrowRight, Calculator } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function RFQSection() {
  const { t, language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
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

  // Слухаємо оновлення інпуту з Hero-секції для React-стану
  useEffect(() => {
    const handleInputSync = () => {
      const inputEl = document.getElementById('rfq-parts-input') as HTMLInputElement | null;
      if (inputEl && inputEl.value !== formData.partNumber) {
        setFormData((prev) => ({ ...prev, partNumber: inputEl.value }));
      }
    };

    const inputEl = document.getElementById('rfq-parts-input');
    if (inputEl) {
      inputEl.addEventListener('input', handleInputSync);
      inputEl.addEventListener('change', handleInputSync);
    }
    return () => {
      if (inputEl) {
        inputEl.removeEventListener('input', handleInputSync);
        inputEl.removeEventListener('change', handleInputSync);
      }
    };
  }, [formData.partNumber]);

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
    <section id="rfq" className="py-24 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 text-red-400 text-xs sm:text-sm font-semibold mb-4 border border-red-500/30">
            <Calculator className="w-4 h-4" />
            <span>{isUk ? 'Прямий розрахунок вартості' : 'Direct Price Calculation'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            {t.rfq.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            {t.rfq.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md"
        >
          {status === 'success' && calculation ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full mb-4 border border-emerald-500/30">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {isUk ? 'Орієнтовну вартість розраховано!' : 'Estimated Price Ready!'}
              </h3>
              <p className="text-slate-400 mb-6">
                {isUk ? 'Орієнтовна вартість для деталі' : 'Estimated price for part'}{' '}
                <strong className="text-white">{calculation.part}</strong>
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 max-w-md mx-auto mb-8 shadow-inner">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  {isUk ? 'Загальна орієнтовна вартість (з доставкою)' : 'Total Estimated Cost (with Shipping)'}
                </div>

                <div className="text-4xl font-black text-red-500 tracking-tight my-2">
                  ~£{calculation.total}
                </div>

                <div className="text-xl font-bold text-slate-200 mb-3">
                  ≈ {getUahTotal()} грн
                </div>

                <div className="text-sm font-medium text-slate-400 pt-3 border-t border-slate-800">
                  £{calculation.unitPrice} (≈ {getUahUnit()} грн) / {isUk ? 'шт' : 'unit'} ({calculation.qty} {isUk ? 'шт' : 'pcs'})
                </div>

                <div className="inline-block mt-3 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300 font-medium">
                  {isUk ? 'Оплата: Revolut Pay, IBAN або картка (~56 грн/£)' : 'Payment: Revolut Pay, IBAN or Card (~56 UAH/£)'}
                </div>

                <p className="text-xs text-slate-500 mt-3">
                  {isUk 
                    ? '* Фінальний рахунок узгоджується та перевіряється менеджером перед оплатою.' 
                    : '* Final invoice is confirmed by our manager before payment.'}
                </p>
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                <p className="text-sm font-bold text-slate-300">
                  {isUk ? 'Оберіть зручний месенджер для підтвердження замовлення:' : 'Select preferred messenger to confirm order:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a
                    href={getViberLink()}
                    className="flex items-center justify-center gap-2 bg-[#7360f2] hover:bg-[#604ec9] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm
