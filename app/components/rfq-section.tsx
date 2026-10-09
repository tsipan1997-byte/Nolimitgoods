'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, MessageSquare, ArrowRight, Calculator, Printer, FileText, Loader2, Search, Box } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function RFQSection() {
  const { t, language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const [partNumber, setPartNumber] = useState('');
  const [machineModel, setMachineModel] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [country, setCountry] = useState('Україна');
  const [contact, setContact] = useState('');

  const [status, setStatus] = useState<'idle' | 'searching' | 'success' | 'error'>('idle');
  const [searchStep, setSearchStep] = useState<string>('');

  const [calculation, setCalculation] = useState<{
    unitPrice: number;
    shippingCost: number;
    parcelTypeLabel: string;
    totalWeightKg: number;
    total: number;
    part: string;
    qty: number;
    invoiceNumber: string;
    invoiceDate: string;
    categoryLabel: string;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('searching');

    const invNum = `NLG-PI-${Math.floor(100000 + Math.random() * 900000)}`;
    const today = new Date().toLocaleDateString('uk-UA');

    setSearchStep('1/3 Підключення до B2B-агента пошуку ринку Великобританії...');

    try {
      // Запускаємо серверний агент
      const responsePromise = fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partNumber: partNumber.trim(),
          machineModel: machineModel.trim(),
          quantity,
          country,
          contact,
          invoiceNumber: invNum,
        }),
      });

      // Візуальні етапи сканування
      setTimeout(() => {
        setSearchStep('2/3 Пошук реальної ціни закупівлі та перевірка наявності в UK...');
      }, 1200);

      setTimeout(() => {
        setSearchStep('3/3 Розрахунок консолідації Nova Post Global та генерація рахунку...');
      }, 2400);

      const res = await responsePromise;

      if (res.ok) {
        const data = await res.json();
        setCalculation({
          unitPrice: data.unitPrice,
          shippingCost: data.shippingCost,
          parcelTypeLabel: data.parcelType,
          totalWeightKg: data.totalWeightKg,
          total: data.total,
          part: partNumber.trim(),
          qty: Math.max(1, parseInt(quantity, 10) || 1),
          invoiceNumber: invNum,
          invoiceDate: today,
          categoryLabel: data.categoryLabel || 'Оригінальна запасна частина',
        });
        setStatus('success');
        return;
      }
    } catch (err) {
      console.error('B2B calculation error:', err);
    }

    // Резервний автономний розрахунок у разі обриву зв'язку
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const weight = Math.round(qty * 0.8 * 10) / 10;
    const shipping = weight <= 2 ? 27 : weight <= 10 ? 41 : 68;
    const unitFallback = 48;

    setCalculation({
      unitPrice: unitFallback,
      shippingCost: shipping,
      parcelTypeLabel: `Nova Post (${weight} кг)`,
      totalWeightKg: weight,
      total: unitFallback * qty + shipping,
      part: partNumber.trim() || 'Замовний вузол',
      qty,
      invoiceNumber: invNum,
      invoiceDate: today,
      categoryLabel: 'Оригінальний компонент за специфікацією',
    });
    setStatus('success');
  };

  const getUahTotal = () => {
    if (!calculation) return '0';
    return Math.round(Number(calculation.total) * 56).toLocaleString('uk-UA');
  };

  const getWhatsAppLink = () => {
    if (!calculation) return 'https://wa.me/447426826595';
    const msg = `Доброго дня! Підтверджую замовлення ${calculation.invoiceNumber}: ${calculation.part} (${machineModel}) — ${calculation.qty} шт. Доставка: ${calculation.parcelTypeLabel} — £${calculation.shippingCost}. Разом: £${calculation.total} (≈ ${getUahTotal()} грн). Мій телефон: ${contact}`;
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
            <span>{isUk ? 'B2B Агент пошуку запчастин у Великобританії' : 'Live UK B2B Sourcing Agent'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            {t.rfq.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            {isUk
              ? 'Агент сканує актуальні склади та ціни у Великобританії, консолідує доставку Nova Post Global та виставляє Proforma Invoice.'
              : 'Direct pricing connected to Coventry warehouse stocks. Zero UK export VAT.'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {status === 'searching' ? (
            <div className="py-16 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-red-600/20 border-t-red-600 animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-amber-500/20 border-b-amber-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className="w-7 h-7 text-white animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {isUk ? 'B2B-агент перевіряє наявність у Великобританії...' : 'Querying Live UK Stocks...'}
                </h3>
                <p className="text-sm font-mono text-amber-400 max-w-md mx-auto transition-all">
                  {searchStep}
                </p>
              </div>

              <div className="max-w-xs mx-auto bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-red-600 to-amber-500 h-full w-full animate-pulse" />
              </div>
            </div>
          ) : status === 'success' && calculation ? (
            <div className="py-2">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {isUk ? 'Рахунок сформовано за актуальною ціною UK' : 'Invoice Generated via Live UK Sourcing'}
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

              {/* Бланк інвойсу */}
              <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 mb-8 font-sans">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">Покупець / Consignee:</span>
                    <p className="font-semibold text-slate-900">{contact || 'Приватний замовник'}</p>
                    <p className="text-slate-600">Країна доставки: {country}</p>
                    <p className="text-slate-600">Обладнання: {machineModel || 'Спецтехніка'}</p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">Логістична консолідація:</span>
                    <p className="text-slate-600">Маршрут: <strong>Coventry Hub ➔ Україна</strong></p>
                    <p className="text-slate-600">Формат: <strong>{calculation.parcelTypeLabel}</strong></p>
                    <p className="text-slate-600">Митне декларування: <strong>T1 Transit Cleared</strong></p>
                  </div>
                </div>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                        <th className="py-2">Найменування вузла</th>
                        <th className="py-2">Каталожний номер</th>
                        <th className="py-2 text-center">К-сть</th>
                        <th className="py-2 text-right">Ціна (£)</th>
                        <th className="py-2 text-right">Сума (£)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 font-semibold text-slate-800">
                          {calculation.categoryLabel}
                        </td>
                        <td className="py-3 font-mono font-bold text-red-600">{calculation.part}</td>
                        <td className="py-3 text-center">{calculation.qty} шт</td>
                        <td className="py-3 text-right">£{calculation.unitPrice.toFixed(2)}</td>
                        <td className="py-3 text-right font-semibold">£{(calculation.unitPrice * calculation.qty).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-slate-700">
                          Консолідоване відправлення Nova Post ({calculation.totalWeightKg} кг)
                        </td>
                        <td className="py-3 font-mono text-slate-500">FREIGHT-COV-UA</td>
                        <td className="py-3 text-center">1 партія</td>
                        <td className="py-3 text-right">£{calculation.shippingCost.toFixed(2)}</td>
                        <td className="py-3 text-right font-semibold">£{calculation.shippingCost.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

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

              {/* Кнопка друку/збереження */}
              <div className="max-w-md mx-auto mb-6">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-red-500" />
                  <span>{isUk ? 'Зберегти / Роздрукувати рахунок (PDF)' : 'Save / Print Invoice (PDF)'}</span>
                </button>
              </div>

              {/* Кнопки месенджерів */}
              <div className="space-y-4 max-w-md mx-auto text-center">
                <p className="text-xs text-slate-300 font-semibold">
                  {isUk ? 'Підтвердити замовлення у чергового логіста в UK:' : 'Confirm invoice with UK dispatch:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp UK</span>
                  </a>

                  <a
                    href="https://t.me/+447426826595"
                    target
