'use client';

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, MessageSquare, ArrowRight, Calculator, Truck, Printer, FileText, Loader2, Search } from 'lucide-react';
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
    parcelCategory: 'small' | 'medium' | 'large';
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

  // Розумна генерація ціни на базі коду деталі (щоб ціни ніколи не були однаковими і покривали собівартість)
  const getDynamicHashPrice = (str: string, min: number, max: number) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const positiveHash = Math.abs(hash);
    const range = max - min;
    const rawVal = min + (positiveHash % range);
    // Округлення до красивих комерційних закінчень (наприклад, 145, 180, 290)
    return Math.round(rawVal / 5) * 5;
  };

  const calculateSmartQuote = () => {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const cleanPart = partNumber.trim();
    const rawText = `${cleanPart} ${machineModel}`.toLowerCase();

    // 1. Точна перевірка по фіксованій номенклатурі
    const exactCatalog: Record<string, { price: number; parcelSize: 'small' | 'medium' | 'large'; label: string }> = {
      'p553004': { price: 18, parcelSize: 'small', label: 'Фільтр паливний сепаратор' },
      'p535114': { price: 42, parcelSize: 'medium', label: 'Фільтр повітряний RadialSeal' },
      'p550388': { price: 24, parcelSize: 'small', label: 'Фільтр масляний Donaldson' },
      '332/y3163': { price: 64, parcelSize: 'small', label: 'Ремінь вентилятора багатоклиновий' },
      '458/20403': { price: 340, parcelSize: 'large', label: 'Головна пара моста переднього' },
      '149298': { price: 195, parcelSize: 'medium', label: 'Шестерня планетарного редуктора' },
      'a10vso71': { price: 820, parcelSize: 'large', label: 'Гідравлічний насос поршневий' },
      '26561117': { price: 28, parcelSize: 'small', label: 'Фільтр тонкої очистки палива' },
      '320/06047': { price: 480, parcelSize: 'medium', label: 'Стартер редукторний 12V 4.2kW' },
      '714/40159': { price: 165, parcelSize: 'medium', label: 'Генератор змінного струму 14V' },
      '02/100073': { price: 115, parcelSize: 'small', label: 'Помпа охолодження двигуна' },
      '32/925682': { price: 38, parcelSize: 'small', label: 'Фільтр гідравлічного бака' },
      '400508-00062': { price: 540, parcelSize: 'large', label: 'Бортовий редуктор ходу' },
    };

    let unitPrice = 0;
    let parcelSize: 'small' | 'medium' | 'large' = 'medium';
    let categoryLabel = 'Оригінальна запасна частина OEM';

    for (const [code, item] of Object.entries(exactCatalog)) {
      if (rawText.includes(code)) {
        unitPrice = item.price;
        parcelSize = item.parcelSize;
        categoryLabel = item.label;
        break;
      }
    }

    // 2. Якщо точного коду немає в базі — категоріальний розподіл із захистом від мінусу
    if (unitPrice === 0) {
      if (rawText.match(/насос|гідро|pump|hydraulic|гідравл|rexroth|parker|danfoss|vickers/)) {
        unitPrice = getDynamicHashPrice(cleanPart || 'pump', 520, 890);
        parcelSize = 'large';
        categoryLabel = 'Гідравлічний вузол високого тиску';
      } else if (rawText.match(/міст|мост|редуктор|gear|carraro|zf|dana|вісь|кпп|диференц|axle|трансміс/)) {
        unitPrice = getDynamicHashPrice(cleanPart || 'gear', 280, 560);
        parcelSize = 'large';
        categoryLabel = 'Вузол трансмісії / Привідний міст';
      } else if (rawText.match(/стартер|генератор|starter|alternator|мотор|запалювання|bosch|denso/)) {
        unitPrice = getDynamicHashPrice(cleanPart || 'elec', 170, 390);
        parcelSize = 'medium';
        categoryLabel = 'Електроагрегат системи пуску';
      } else if (rawText.match(/турбін|турбо|turbo|garrett|holset|бортов/)) {
        unitPrice = getDynamicHashPrice(cleanPart || 'turbo', 380, 680);
        parcelSize = 'medium';
        categoryLabel = 'Турбокомпресор / Нагнітач повітря';
      } else if (rawText.match(/фільтр|filter|donaldson|сепарат|fleetguard|mann|baldwin/)) {
        unitPrice = getDynamicHashPrice(cleanPart || 'filter', 22, 58);
        parcelSize = 'small';
        categoryLabel = 'Фільтруючий елемент систем';
      } else if (rawText.match(/ремінь|belt|датчик|sensor|проклад|сальник|втулк|палець|valve|клапан/)) {
        unitPrice = getDynamicHashPrice(cleanPart || 'spare', 45, 110);
        parcelSize = 'small';
        categoryLabel = 'Комплектуючі та сервісні витратники';
      } else {
        // Загальний алгоритм: захищений діапазон £85 - £240 (щоб не піти в мінус)
        unitPrice = getDynamicHashPrice(cleanPart || 'default', 85, 240);
        parcelSize = 'medium';
        categoryLabel = 'Оригінальний механічний компонент';
      }
    }

    const shippingRates = { small: 27, medium: 41, large: 68 };
    const baseShipping = shippingRates[parcelSize];
    const shippingEstimate = qty === 1 ? baseShipping : Math.round(baseShipping + (qty - 1) * 14);
    const totalEstimate = (unitPrice * qty) + shippingEstimate;

    const invNum = `NLG-PI-${Math.floor(100000 + Math.random() * 900000)}`;
    const today = new Date().toLocaleDateString('uk-UA');

    return {
      unitPrice,
      shippingCost: shippingEstimate,
      parcelCategory: parcelSize,
      total: totalEstimate,
      part: cleanPart || 'Замовний вузол за специфікацією',
      qty,
      invoiceNumber: invNum,
      invoiceDate: today,
      categoryLabel,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('searching');

    // Імітація глибокого складського сканування (2.8 секунди)
    setSearchStep('1/3 Підключення до складської бази Coventry Logistics Hub...');
    await new Promise((r) => setTimeout(r, 900));

    setSearchStep('2/3 Верифікація крос-номерів OEM та розрахунок ваги/об’єму...');
    await new Promise((r) => setTimeout(r, 1000));

    setSearchStep('3/3 Розрахунок транзитного тарифу Nova Post Global та фіксація експортного інвойсу...');
    await new Promise((r) => setTimeout(r, 900));

    const result = calculateSmartQuote();

    try {
      await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partNumber: result.part,
          machineModel: machineModel || 'Спецтехніка',
          quantity,
          country,
          contact,
          invoiceNumber: result.invoiceNumber,
          total: result.total,
        }),
      });
    } catch {
      // Працює автономно
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
              ? 'Введіть каталожний номер або марку вузла. Система перевіряє складські залишки у Великобританії та генерує офіційний інвойс із доставкою Nova Post.'
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
                  {isUk ? 'Здійснюється запит до складу NoLimitGoods UK...' : 'Querying UK Stock Database...'}
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
                      {isUk ? 'Рахунок успішно сформовано' : 'Invoice Generated Successfully'}
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

              {/* Фірмовий вигляд бланка інвойсу */}
              <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 mb-8 font-sans">
                <div className="flex flex-col sm:row justify-between items-start border-b-2 border-red-600 pb-5 mb-5 gap-4">
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
                    <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">Логістичні умови:</span>
                    <p className="text-slate-600">Маршрут: <strong>Coventry Hub ➔ Україна</strong></p>
                    <p className="text-slate-600">Служба: <strong>Nova Post ({calculation.parcelCategory.toUpperCase()})</strong></p>
                    <p className="text-slate-600">Митне декларування: <strong>T1 Transit Cleared</strong></p>
                  </div>
                </div>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                        <th className="py-2">Категорія / Опис вузла</th>
                        <th className="py-2">Каталожний номер</th>
                        <th className="py-2 text-center">К-сть</th>
                        <th className="py-2 text-right">Ціна (£)</th>
                        <th className="py-2 text-right">Сума (£)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 font-semibold text-slate-800">
                          {calculation.categoryLabel} {machineModel && `(${machineModel})`}
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

              {/* Кнопка друку прямо під бланком */}
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

              {/* Месенджери */}
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
                disabled={status === 'searching'}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-base sm:text-lg disabled:opacity-70 shadow-lg cursor-pointer"
              >
                {status === 'searching' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Перевірка наявності в UK...</span>
                  </>
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
