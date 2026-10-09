'use client';

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, MessageSquare, ArrowRight, Calculator, Truck, Printer, FileText } from 'lucide-react';
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
    invoiceNumber: string;
    invoiceDate: string;
  } | null>(null);

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

    const shippingRates = { small: 27, medium: 41, large: 68 };
    const baseShipping = shippingRates[parcelSize];
    const shippingEstimate = qty === 1 ? baseShipping : Math.round(baseShipping + (qty - 1) * 12);
    const totalEstimate = (unitPrice * qty) + shippingEstimate;

    const invNum = `NLG-PI-${Math.floor(100000 + Math.random() * 900000)}`;
    const today = new Date().toLocaleDateString('uk-UA');

    return {
      unitPrice,
      shippingCost: shippingEstimate,
      parcelCategory: parcelSize,
      total: totalEstimate,
      part: partNumber || 'Запчастина за запитом',
      qty,
      invoiceNumber: invNum,
      invoiceDate: today,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const result = calculateQuote();

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
          invoiceNumber: result.invoiceNumber,
          total: result.total,
        }),
      });
    } catch {
      // Автономний режим
    }

    setCalculation(result);
    setStatus('success');
  };

  const getUahTotal = () => {
    if (!calculation) return '0';
    return Math.round(Number(calculation.total) * 56).toLocaleString('uk-UA');
  };

  const getWhatsAppLink = () => {
    if (!calculation) return 'https://wa.me/447426826595';
    const msg = `Доброго дня! Підтверджую рахунок-проформу ${calculation.invoiceNumber}: ${calculation.part} (${machineModel}) у кількості ${calculation.qty} шт. Доставка Nova Post: £${calculation.shippingCost}. Загальна сума: £${calculation.total} (≈ ${getUahTotal()} грн). Мій контакт: ${contact}`;
    return `https://wa.me/447426826595?text=${encodeURIComponent(msg)}`;
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
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 text-red-400 text-xs sm:text-sm font-semibold mb-4 border border-red-500/30">
            <Calculator className="w-4 h-4" />
            <span>{isUk ? 'Прямий розрахунок вартості та інвойс' : 'Direct Calculation & Proforma Invoice'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            {t.rfq.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            {isUk
              ? 'Отримайте миттєву калькуляцію з доставкою Nova Post та офіційний рахунок-проформу UK Ltd прямо на екрані.'
              : 'Instant pricing with Nova Post logistics and live UK Ltd Proforma Invoice.'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {status === 'success' && calculation ? (
            <div className="py-2">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {isUk ? 'Рахунок успішно згенеровано' : 'Invoice Generated Successfully'}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Ref: {calculation.invoiceNumber} • {calculation.invoiceDate}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer active:scale-95"
                >
                  <Printer className="w-4 h-4 text-red-500" />
                  <span>{isUk ? 'Друкувати / PDF' : 'Print / PDF'}</span>
                </button>
              </div>

              {/* Фірмовий вигляд бланка інвойсу прямо в браузері */}
              <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 mb-8 font-sans">
                {/* Шапка бланка */}
                <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-red-600 pb-5 mb-5 gap-4">
                  <div>
                    <div className="text-2xl font-black tracking-tight text-slate-950">
                      NoLimitGoods <span className="text-red-600">LTD</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      UK Export Hub & Machinery Logistics Solutions
                    </div>
                  </div>
                  <div className="text-left sm:text-right text-[11px] text-slate-600 leading-relaxed font-mono">
                    <strong className="text-slate-900">NoLimitGoods Limited</strong><br />
                    Company No: 13146899 | VAT: GB 372654187<br />
                    EORI: GB079878335000<br />
                    374 Hipsell Highway, Coventry, CV2 5FR, UK
                  </div>
                </div>

                {/* Заголовок документа */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-lg font-black uppercase text-slate-900 tracking-wider">
                      PROFORMA INVOICE
                    </h4>
                    <span className="inline-block bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded mt-1">
                      UK EXPORT — 0% VAT ZERO-RATED
                    </span>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Рахунок №:</span>
                    <strong className="text-slate-900 font-mono">{calculation.invoiceNumber}</strong>
                  </div>
                </div>

                {/* Реквізити сторін */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">Покупець / Consignee:</span>
                    <p className="font-semibold text-slate-900">{contact || 'Приватний замовник'}</p>
                    <p className="text-slate-600">Країна доставки: {country}</p>
                    <p className="text-slate-600">Обладнання: {machineModel || 'Спецтехніка'}</p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">Логістичні умови:</span>
                    <p className="text-slate-600">Маршрут: <strong>Coventry Hub ➔ Україна</strong></p>
                    <p className="text-slate-600">Служба: <strong>Nova Post ({calculation.parcelCategory.toUpperCase()})</strong></p>
                    <p className="text-slate-600">Митне декларування: <strong>T1 Transit Cleared</strong></p>
                  </div>
                </div>

                {/* Таблиця товарів */}
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                        <th className="py-2">Опис деталі</th>
                        <th className="py-2">Каталожний номер</th>
                        <th className="py-2 text-center">К-сть</th>
                        <th className="py-2 text-right">Ціна (£)</th>
                        <th className="py-2 text-right">Сума (£)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 font-semibold text-slate-800">
                          Оригінальний вузол {machineModel}
                        </td>
                        <td className="py-3 font-mono font-bold text-red-600">{calculation.part}</td>
                        <td className="py-3 text-center">{calculation.qty} шт</td>
                        <td className="py-3 text-right">£{calculation.unitPrice.toFixed(2)}</td>
                        <td className="py-3 text-right font-semibold">£{(calculation.unitPrice * calculation.qty).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-slate-700">
                          Експрес-доставка Nova Post Global ({calculation.parcelCategory.toUpperCase()})
                        </td>
                        <td className="py-3 font-mono text-slate-500">FREIGHT-COV-UA</td>
                        <td className="py-3 text-center">1</td>
                        <td className="py-3 text-right">£{calculation.shippingCost.toFixed(2)}</td>
                        <td className="py-3 text-right font-semibold">£{calculation.shippingCost.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Підсумкова сума */}
                <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-[11px] text-slate-500 max-w-sm">
                    Рахунок дійсний 5 банківських днів. Оплата за безготівковим розрахунком (IBAN/SWIFT) або карткою. 0% UK VAT.
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 uppercase font-bold block">Разом до сплати:</span>
                    <div className="text-2xl sm:text-3xl font-black text-red-600">
                      £{calculation.total.toFixed(2)}
                    </div>
                    <div className="text-xs font-bold text-slate-700">
                      ≈ {getUahTotal()} грн
                    </div>
                  </div>
                </div>
              </div>

              {/* Дії з месенджерами */}
              <div className="space-y-4 max-w-md mx-auto text-center">
                <p className="text-xs text-slate-300 font-semibold">
                  {isUk ? 'Надіслати підтвердження у відділ комплектації:' : 'Send invoice confirmation to dispatch:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href="https://t.me/+447426826595"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#229ED9] hover:bg-[#1d87b9] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs cursor-pointer"
                  >
                    <span>Telegram</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-xs"
                >
                  {isUk ? 'Розрахувати інший вузол' : 'New Quote'}
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
                    <FileText className="w-5 h-5" />
                    <span>{isUk ? 'Розрахувати вартість та сформувати інвойс' : 'Calculate & Generate Invoice'}</span>
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
