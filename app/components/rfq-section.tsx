'use client';

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, MessageSquare, ArrowRight, Calculator, Truck, Package } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function RFQSection() {
  const { t, language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const [partNumber, setPartNumber] = useState('');
  const [machineModel, setMachineModel] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [country, setCountry] = useState('Україна');
  const [contact, setContact] = useState('');

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [calculation, setCalculation] = useState<{
    unitPrice: number;
    shippingCost: number;
    parcelCategory: 'small' | 'medium' | 'large';
    total: number;
    part: string;
    qty: number;
  } | null>(null);

  // Синхронізація інпутів із кліками по каталогу та брендах
  useEffect(() => {
    const handleSync = () => {
      const partEl = document.getElementById('rfq-parts-input') as HTMLInputElement | null;
      if (partEl && partEl.value !== partNumber) {
        setPartNumber(partEl.value);
      }
      const modelEl = document.getElementById('rfq-machine-input') as HTMLInputElement | null;
      if (modelEl && modelEl.value !== machineModel) {
        setMachineModel(modelEl.value);
      }
    };

    const partEl = document.getElementById('rfq-parts-input');
    const modelEl = document.getElementById('rfq-machine-input');

    if (partEl) {
      partEl.addEventListener('input', handleSync);
      partEl.addEventListener('change', handleSync);
    }
    if (modelEl) {
      modelEl.addEventListener('input', handleSync);
      modelEl.addEventListener('change', handleSync);
    }

    return () => {
      if (partEl) {
        partEl.removeEventListener('input', handleSync);
        partEl.removeEventListener('change', handleSync);
      }
      if (modelEl) {
        modelEl.removeEventListener('input', handleSync);
        modelEl.removeEventListener('change', handleSync);
      }
    };
  }, [partNumber, machineModel]);

  // Розрахунок тарифів Nova Post прямо на фронтенді (все в одному)
  const calculateQuote = () => {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    const catalogData: Record<string, { price: number; parcelSize: 'small' | 'medium' | 'large' }> = {
      'P553004': { price: 18, parcelSize: 'small' },
      'P535114': { price: 42, parcelSize: 'medium' },
      '332/Y3163': { price: 64, parcelSize: 'small' },
      '458/20403': { price: 340, parcelSize: 'large' },
      '149298': { price: 195, parcelSize: 'medium' },
      'A10VSO71': { price: 820, parcelSize: 'large' },
      '26561117': { price: 28, parcelSize: 'small' },
      '320/06047': { price: 480, parcelSize: 'medium' },
      '714/40159': { price: 165, parcelSize: 'medium' },
    };

    let unitPrice = 65;
    let parcelSize: 'small' | 'medium' | 'large' = 'medium';

    const cleanInput = `${partNumber} ${machineModel}`.toUpperCase();
    for (const [code, item] of Object.entries(catalogData)) {
      if (cleanInput.includes(code)) {
        unitPrice = item.price;
        parcelSize = item.parcelSize;
        break;
      }
    }

    // Тарифи Nova Post: Small = £27, Medium = £41, Large = £68
    const shippingRates = { small: 27, medium: 41, large: 68 };
    const baseShipping = shippingRates[parcelSize];
    const shippingEstimate = qty === 1 ? baseShipping : Math.round(baseShipping + (qty - 1) * 12);
    const totalEstimate = (unitPrice * qty) + shippingEstimate;

    return {
      unitPrice,
      shippingCost: shippingEstimate,
      parcelCategory: parcelSize,
      total: totalEstimate,
      part: partNumber || 'Запчастина за запитом',
      qty,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const result = calculateQuote();

    // Спроба відправити на бекенд (якщо API налаштоване)
    try {
      await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partNumber,
          machineModel,
          quantity,
          country,
          contact,
        }),
      });
    } catch {
      // Працює автономно навіть якщо бекенд не відповів
    }

    setCalculation(result);
    setStatus('success');
  };

  const getUahTotal = () => {
    if (!calculation) return '0';
    return Math.round(Number(calculation.total) * 56).toLocaleString('uk-UA');
  };

  const getUahUnit = () => {
    if (!calculation) return '0';
    return Math.round(Number(calculation.unitPrice) * 56).toLocaleString('uk-UA');
  };

  const getUahShipping = () => {
    if (!calculation) return '0';
    return Math.round(Number(calculation.shippingCost) * 56).toLocaleString('uk-UA');
  };

  const getWhatsAppLink = () => {
    if (!calculation) return 'https://wa.me/447426826595';
    const msg = `Доброго дня! Хочу замовити: ${calculation.part} (${machineModel}) у кількості ${calculation.qty} шт. Вартість деталі: £${calculation.unitPrice * calculation.qty}. Доставка Nova Post (${calculation.parcelCategory.toUpperCase()}): £${calculation.shippingCost}. Загалом: ~£${calculation.total} (≈ ${getUahTotal()} грн). Мій контакт: ${contact}`;
    return `https://wa.me/447426826595?text=${encodeURIComponent(msg)}`;
  };

  const getViberLink = () => {
    return 'viber://chat?number=%2B447426826595';
  };

  const getTelegramLink = () => {
    return 'https://t.me/+447426826595';
  };

  const resetForm = () => {
    setStatus('idle');
    setCalculation(null);
    setPartNumber('');
    setMachineModel('');
    setQuantity('1');
    setCountry('Україна');
    setContact('');
  };

  return (
    <section id="rfq" className="py-24 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 text-red-400 text-xs sm:text-sm font-semibold mb-4 border border-red-500/30">
            <Calculator className="w-4 h-4" />
            <span>{isUk ? 'Прямий розрахунок вартості та доставки' : 'Direct Price & Delivery Calculation'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            {t.rfq.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            {isUk
              ? 'Введіть номер деталі або оберіть її в каталозі нижче. Тариф доставки Nova Post (Small £27, Medium £41, Large £68) прораховується автоматично.'
              : 'Enter part number or choose from catalog. Nova Post UK express tariffs are calculated automatically.'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {status === 'success' && calculation ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full mb-4 border border-emerald-500/30">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {isUk ? 'Повний розрахунок вартості готовий!' : 'Calculation Completed!'}
              </h3>
              <p className="text-slate-400 mb-6">
                {isUk ? 'Позиція:' : 'Item:'}{' '}
                <strong className="text-white">{calculation.part}</strong> {machineModel && `(${machineModel})`}
              </p>

              {/* Картка підсумку з деталізацією ціни та доставки Новою Поштою */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 max-w-md mx-auto mb-8 shadow-inner text-left">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-850 pb-3 mb-3">
                  <span>{isUk ? 'Ціна деталі зі складу UK:' : 'Part Price (UK stock):'}</span>
                  <span className="font-bold text-white">£{calculation.unitPrice * calculation.qty} (≈ {Math.round(calculation.unitPrice * calculation.qty * 56).toLocaleString('uk-UA')} грн)</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-850 pb-3 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Доставка Nova Post ({calculation.parcelCategory.toUpperCase()}):</span>
                  </span>
                  <span className="font-bold text-amber-400">£{calculation.shippingCost} (≈ {getUahShipping()} грн)</span>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                    {isUk ? 'РАЗОМ ДО СПЛАТИ З ДОСТАВКОЮ:' : 'TOTAL LANDED ESTIMATE:'}
                  </span>
                  <div className="text-4xl font-black text-red-500 tracking-tight my-1">
                    ~£{calculation.total}
                  </div>
                  <div className="text-xl font-bold text-slate-200">
                    ≈ {getUahTotal()} грн
                  </div>
                </div>

                <div className="mt-4 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-400 text-center">
                  {isUk ? 'Оплата: 0% UK VAT експортний рахунок, IBAN, картка або безготівка.' : 'Payment: 0% UK VAT export invoice, IBAN or Card.'}
                </div>
              </div>

              {/* Кнопки месенджерів */}
              <div className="space-y-4 max-w-md mx-auto">
                <p className="text-sm font-bold text-slate-300">
                  {isUk ? 'Підтвердіть замовлення у зручному месенджері:' : 'Confirm order via preferred messenger:'}
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
                  onClick={resetForm}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-6 rounded-xl transition-colors cursor-pointer text-sm mt-3"
                >
                  {isUk ? 'Розрахувати іншу деталь' : 'Calculate Another Part'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    {t.rfq.form.partNumber} *
                  </label>
                  <input
                    id="rfq-parts-input"
                    type="text"
                    required
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 text-white placeholder-slate-500 border border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="наприклад: P553004 або 458/20403"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    {t.rfq.form.machineModel} *
                  </label>
                  <input
                    id="rfq-machine-input"
                    type="text"
                    required
                    value={machineModel}
                    onChange={(e) => setMachineModel(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 text-white placeholder-slate-500 border border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="наприклад: JCB 3CX / Donaldson / Carraro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    {t.rfq.form.quantity} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 text-white placeholder-slate-500 border border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    {t.rfq.form.country} *
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 text-white placeholder-slate-500 border border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="Україна"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  {t.rfq.form.contact} *
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 text-white placeholder-slate-500 border border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  placeholder="+380... або email@domain.com"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-base sm:text-lg disabled:opacity-70 shadow-lg cursor-pointer"
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
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
