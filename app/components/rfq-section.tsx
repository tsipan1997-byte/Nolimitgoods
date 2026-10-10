'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  MessageSquare,
  ArrowRight,
  Calculator,
  Printer,
  FileText,
  Loader2,
  Search,
  Box,
  Clock,
  CreditCard,
  ShieldCheck,
  Plus,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface RFQItemInput {
  id: string;
  partNumber: string;
  machineModel: string;
  quantity: string;
}

interface CalculatedItem {
  partNumber: string;
  machineModel: string;
  quantity: number;
  partTitle: string;
  clientUnitPriceGbp: number;
  totalWeightKg: number;
  itemTotalGbp: number;
}

export default function RFQSection() {
  const { t, language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const [items, setItems] = useState<RFQItemInput[]>([
    { id: '1', partNumber: '', machineModel: '', quantity: '1' },
  ]);
  const [country, setCountry] = useState('Україна');
  const [contact, setContact] = useState('');

  const [status, setStatus] = useState<'idle' | 'searching' | 'success' | 'wait_for_rfq' | 'error'>('idle');
  const [searchStep, setSearchStep] = useState<string>('');
  const [paying, setPaying] = useState(false);

  const [calculation, setCalculation] = useState<{
    items: CalculatedItem[];
    itemsSubtotal: number;
    shippingCost: number;
    parcelTypeLabel: string;
    totalWeightKg: number;
    total: number;
    invoiceNumber: string;
    invoiceDate: string;
  } | null>(null);

  const addItem = () => {
    if (items.length >= 10) return;
    setItems((prev) => [
      ...prev,
      { id: String(Date.now()), partNumber: '', machineModel: '', quantity: '1' },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const updateItem = (id: string, field: keyof RFQItemInput, val: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: val } : it))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('searching');

    const invNum = `NLG-PI-${Math.floor(100000 + Math.random() * 900000)}`;
    const today = new Date().toLocaleDateString('uk-UA');

    setSearchStep('1/3 Перевірка наявності деталей на складах UK та Європи...');

    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((it) => ({
            partNumber: it.partNumber.trim(),
            machineModel: it.machineModel.trim(),
            quantity: Math.max(1, parseInt(it.quantity, 10) || 1),
          })),
          country,
          contact,
          invoiceNumber: invNum,
        }),
      });

      setSearchStep('2/3 Розрахунок цін та консолідація доставки Nova Post...');

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      setSearchStep('3/3 Формування рахунку-фактури...');

      if (!data.found || data.status === 'wait_for_rfq') {
        setStatus('wait_for_rfq');
        return;
      }

      setCalculation({
        items: data.items,
        itemsSubtotal: Number(data.itemsSubtotal),
        shippingCost: Number(data.shippingCost),
        parcelTypeLabel: data.parcelType,
        totalWeightKg: Number(data.totalWeightKg),
        total: Number(data.total),
        invoiceNumber: invNum,
        invoiceDate: today,
      });
      setStatus('success');
    } catch (err) {
      console.error('Calculation error:', err);
      setStatus('wait_for_rfq');
    }
  };

  const handleOnlinePayment = async () => {
    if (!calculation) return;
    setPaying(true);

    try {
      const summaryText = calculation.items
        .map((it) => `${it.partNumber} (x${it.quantity})`)
        .join(', ');

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNumber: calculation.invoiceNumber,
          partNumber: summaryText,
          categoryLabel: `Специфікація (${calculation.items.length} поз.)`,
          totalAmount: calculation.total,
          contact,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Помилка платіжного шлюзу. Зв’яжіться з офісом NoLimitGoods.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Не вдалося з’єднатися з сервером оплати.');
    } finally {
      setPaying(false);
    }
  };

  const getUahTotal = () => {
    if (!calculation) return '0';
    return Math.round(Number(calculation.total) * 56).toLocaleString('uk-UA');
  };

  const getWaitWhatsAppLink = () => {
    const list = items
      .map((it, idx) => `${idx + 1}. ${it.partNumber} (${it.machineModel || 'Спецтехніка'}) — ${it.quantity} шт`)
      .join('\n');
    const msg = `Доброго дня! Запит (WAIT FOR RFQ) на специфікацію:\n${list}\n\nКонтакт: ${contact}`;
    return `https://wa.me/447426826595?text=${encodeURIComponent(msg)}`;
  };

  const getWhatsAppLink = () => {
    if (!calculation) return 'https://wa.me/447426826595';
    const msg = `Доброго дня! Підтверджую замовлення ${calculation.invoiceNumber} на ${calculation.items.length} поз. Разом: £${calculation.total} (≈ ${getUahTotal()} грн). Мій контакт: ${contact}`;
    return `https://wa.me/447426826595?text=${encodeURIComponent(msg)}`;
  };

  const resetForm = () => {
    setStatus('idle');
    setCalculation(null);
    setItems([{ id: '1', partNumber: '', machineModel: '', quantity: '1' }]);
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
            <span>{isUk ? 'B2B Калькулятор специфікацій (до 10 позицій)' : 'Multi-Item B2B Procurement Portal'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            {t.rfq.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            {isUk
              ? 'Додавайте до 10 артикулів в одну заявку. Агент сканує склади в реальному часі та об’єднує доставку Nova Post в один збірний вантаж.'
              : 'Add up to 10 OEM parts to a single proforma invoice with consolidated UK airfreight.'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {status === 'searching' ? (
            <div className="py-16 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-red-600/20 border-t-red-600 animate-spin" />
                <div
                  className="absolute inset-2 rounded-full border-4 border-amber-500/20 border-b-amber-500 animate-spin"
                  style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className="w-7 h-7 text-white animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {isUk ? 'Перевірка специфікації по складах UK та Європи...' : 'Querying Stocks for Multiple Items...'}
                </h3>
                <p className="text-sm font-mono text-amber-400 max-w-md mx-auto transition-all">
                  {searchStep}
                </p>
              </div>

              <div className="max-w-xs mx-auto bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-red-600 to-amber-500 h-full w-full animate-pulse" />
              </div>
            </div>
          ) : status === 'wait_for_rfq' ? (
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs uppercase font-mono font-bold px-3 py-1 rounded-full mb-3">
                  STATUS: WAIT FOR RFQ
                </span>
                <h3 className="text-2xl font-black text-white mb-2">
                  {isUk ? 'Специфікацію передано в обробку (Хаб Ковентрі)' : 'Transferred to Coventry Office'}
                </h3>
                <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  {isUk
                    ? `Частина деталей потребує індивідуальної звірки зі складами дистриб'юторів. Офіс NoLimitGoods підготує повний комерційний розрахунок.`
                    : 'Parts require verification with UK distribution hubs. Our office will respond shortly.'}
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="text-slate-400 font-bold mb-2">Запитані деталі ({items.length} поз.):</div>
                {items.map((it, idx) => (
                  <div key={it.id} className="flex justify-between text-slate-300 border-b border-slate-800/60 pb-1">
                    <span>{idx + 1}. {it.partNumber || '—'} ({it.machineModel || 'Спецтехніка'})</span>
                    <span className="font-mono text-white">{it.quantity} шт</span>
                  </div>
                ))}
                <div className="flex justify-between text-slate-400 pt-2">
                  <span>Контакт:</span>
                  <span className="text-white">{contact}</span>
                </div>
              </div>

              <div className="space-y-3 max-w-md mx-auto">
                <a
                  href={getWaitWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all text-xs cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Узгодити специфікацію (WhatsApp UK)</span>
                </a>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-xs"
                >
                  {isUk ? 'Новий розрахунок' : 'New Calculation'}
                </button>
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
                      {isUk ? `Рахунок сформовано (${calculation.items.length} позицій)` : `Invoice Ready (${calculation.items.length} Items)`}
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
                        <th className="py-2">№</th>
                        <th className="py-2">Найменування вузла</th>
                        <th className="py-2">Артикул OEM</th>
                        <th className="py-2 text-center">К-сть</th>
                        <th className="py-2 text-right">Ціна (+20%)</th>
                        <th className="py-2 text-right">Сума (£)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {calculation.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="py-3 text-slate-400">{idx + 1}</td>
                          <td className="py-3 font-semibold text-slate-800">{it.partTitle}</td>
                          <td className="py-3 font-mono font-bold text-red-600">{it.partNumber}</td>
                          <td className="py-3 text-center">{it.quantity} шт</td>
                          <td className="py-3 text-right">£{it.clientUnitPriceGbp.toFixed(2)}</td>
                          <td className="py-3 text-right font-semibold">£{it.itemTotalGbp.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50/70">
                        <td colSpan={4} className="py-3 px-2 font-medium text-slate-700">
                          Консолідована доставка Nova Post (загальна вага {calculation.totalWeightKg} кг)
                        </td>
                        <td className="py-3 text-right font-mono text-slate-500">FREIGHT</td>
                        <td className="py-3 text-right font-semibold text-slate-900">
                          £{calculation.shippingCost.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-[11px] text-slate-500 max-w-sm">
                    Рахунок дійсний 5 банківських днів. 0% UK VAT. Оплата за безготівковим розрахунком (IBAN/SWIFT) або онлайн карткою.
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

              {/* Оплата карткою онлайн */}
              <div className="max-w-md mx-auto space-y-3 mb-6">
                <button
                  type="button"
                  onClick={handleOnlinePayment}
                  disabled={paying}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm sm:text-base transition-all shadow-xl hover:shadow-red-600/25 active:scale-95 cursor-pointer disabled:opacity-70"
                >
                  {paying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Відкриття захищеного шлюзу...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Оплатити онлайн усю специфікацію: £{calculation.total.toFixed(2)}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Захищений платіж UK 3D-Secure • Apple Pay • Google Pay • Visa / MC</span>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-red-500" />
                  <span>Зберегти офіційний інвойс (PDF)</span>
                </button>
              </div>

              {/* Месенджери */}
              <div className="space-y-4 max-w-md mx-auto text-center border-t border-slate-800 pt-6">
                <p className="text-xs text-slate-400">
                  Або підтвердіть замовлення через офіс у Ковентрі:
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
                  className="w-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 font-medium py-2 px-4 rounded-xl transition-colors cursor-pointer text-xs"
                >
                  {isUk ? 'Розрахувати нову специфікацію' : 'New Quote'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    Перелік запчастин (Позиції 1–{items.length} з 10):
                  </span>
                  {items.length < 10 && (
                    <button
                      type="button"
                      onClick={addItem}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/40 border border-red-800/50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Додати позицію</span>
                    </button>
                  )}
                </div>

                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl relative space-y-3"
                  >
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                      <span>Позиція #{index + 1}</span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-slate-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                          title="Видалити"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] text-slate-400 mb-1">Каталожний номер OEM *</label>
                        <input
                          type="text"
                          required
                          value={item.partNumber}
                          onChange={(e) => updateItem(item.id, 'partNumber', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 text-white placeholder-slate-500 border border-slate-700 rounded-lg text-sm focus:border-red-500 outline-none"
                          placeholder="напр. P535114"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] text-slate-400 mb-1">Техніка / Бренд *</label>
                        <input
                          type="text"
                          required
                          value={item.machineModel}
                          onChange={(e) => updateItem(item.id, 'machineModel', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 text-white placeholder-slate-500 border border-slate-700 rounded-lg text-sm focus:border-red-500 outline-none"
                          placeholder="напр. Donaldson / JCB"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] text-slate-400 mb-1">Кількість (шт) *</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 text-white border border-slate-700 rounded-lg text-sm focus:border-red-500 outline-none"
                          placeholder="1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    {t.rfq.form.country} *
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 text-white placeholder-slate-500 border border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm"
                    placeholder="Україна"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    {t.rfq.form.contact} *
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 text-white placeholder-slate-500 border border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm"
                    placeholder="+380... або email@domain.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'searching'}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-base sm:text-lg disabled:opacity-70 shadow-lg cursor-pointer"
              >
                {status === 'searching' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Сканування та консолідація специфікації...</span>
                  </>
                ) : (
                  <>
                    <Box className="w-5 h-5" />
                    <span>
                      {isUk
                        ? `Прорахувати специфікацію (${items.length} поз.)`
                        : `Calculate Specification (${items.length} Items)`}
                    </span>
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
