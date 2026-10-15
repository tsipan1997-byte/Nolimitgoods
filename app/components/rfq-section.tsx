'use client';

import React, { useState, useEffect } from 'react';
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
  const [country, setCountry] = useState(isUk ? 'Україна' : 'Ukraine');
  const [contact, setContact] = useState('');

  const [status, setStatus] = useState<any>('idle');
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

  useEffect(() => {
    const handleSelectPartEvent = (e: any) => {
      const { oem, brand } = e.detail || {};
      if (!oem) return;

      setItems((prev) => {
        const next = [...prev];
        next[0] = {
          ...next[0],
          partNumber: oem,
          machineModel: brand || next[0].machineModel || '',
        };
        return next;
      });

      const section = document.getElementById('parts-calculator');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.addEventListener('nlg:select-part', handleSelectPartEvent);
    return () => window.removeEventListener('nlg:select-part', handleSelectPartEvent);
  }, []);

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
    const today = new Date().toLocaleDateString(isUk ? 'uk-UA' : 'en-GB');

    setSearchStep(
      isUk
        ? '1/3 Перевірка наявності деталей на складах UK та Європи...'
        : '1/3 Checking live inventory across UK & EU distributor stocks...'
    );

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

      setSearchStep(
        isUk
          ? '2/3 Розрахунок цін та консолідація доставки Nova Post...'
          : '2/3 Calculating pricing & consolidating freight route...'
      );

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      setSearchStep(
        isUk ? '3/3 Формування рахунку-фактури...' : '3/3 Generating Proforma Invoice...'
      );

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

      // ВІДПРАВКА КОНВЕРСІЇ В GOOGLE ADS
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          send_to: 'AW-670192610/Sx8lCIG5m54dEOKnyb8C',
          value: Number(data.total),
          currency: 'GBP',
        });
      }
    } catch (err) {
      console.error('Calculation error:', err);
      setStatus('wait_for_rfq');
    }
  };

  const handlePrintIsolated = () => {
    const invoiceEl = document.getElementById('printable-invoice');
    if (!invoiceEl) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=850,height=1000');
    if (!printWindow) {
      window.print();
      return;
    }

    const invoiceContent = invoiceEl.innerHTML;

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${calculation?.invoiceNumber || 'NoLimitGoods'}</title>
          <style>
            @page { size: A4 portrait; margin: 12mm; }
            * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; background: #fff; margin: 0; padding: 0; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { text-align: left; padding: 8px 4px; border-bottom: 2px solid #cbd5e1; font-size: 10px; text-transform: uppercase; color: #64748b; }
            td { padding: 8px 4px; border-bottom: 1px solid #f1f5f9; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
            .font-bold { font-weight: bold; }
            .font-black { font-weight: 900; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .items-start { align-items: flex-start; }
            .items-center { align-items: center; }
            .border-b-2 { border-bottom: 2px solid #0f172a; }
            .border-t { border-top: 1px solid #e2e8f0; }
            .pb-5 { padding-bottom: 15px; }
            .mb-5 { margin-bottom: 15px; }
            .mb-6 { margin-bottom: 20px; }
            .pt-4 { padding-top: 15px; }
            .p-4 { padding: 12px; }
            .bg-slate-50 { background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; }
            .text-red-600 { color: #dc2626; }
            .text-slate-400 { color: #94a3b8; }
            .text-slate-500 { color: #64748b; }
            .text-slate-600 { color: #475569; }
            .text-slate-900 { color: #0f172a; }
            .text-slate-950 { color: #020617; }
            .text-emerald-800 { color: #065f46; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 6px; border-radius: 4px; font-size: 9px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          </style>
        </head>
        <body>
          <div>${invoiceContent}</div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleOnlinePayment = async () => {
    if (!calculation) return;
    setPaying(true);

    try {
      const summaryText = calculation.items
        .map((it) => `${it.partNumber} [${it.machineModel || 'OEM'}] (x${it.quantity})`)
        .join(', ');

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNumber: calculation.invoiceNumber,
          partNumber: summaryText,
          categoryLabel: isUk
            ? `Специфікація (${calculation.items.length} поз.)`
            : `Specification (${calculation.items.length} items)`,
          totalAmount: calculation.total,
          contact,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(
          data.error ||
            (isUk
              ? 'Помилка платіжного шлюзу. Зв’яжіться з офісом NoLimitGoods.'
              : 'Payment gateway error. Please contact NoLimitGoods office.')
        );
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert(
        isUk
          ? 'Не вдалося з’єднатися з сервером оплати.'
          : 'Unable to connect to payment gateway.'
      );
    } finally {
      setPaying(false);
    }
  };

  const getUahTotal = () => {
    if (!calculation) return '0';
    return Math.round(Number(calculation.total) * 56).toLocaleString(isUk ? 'uk-UA' : 'en-US');
  };

  const getWaitWhatsAppLink = () => {
    const list = items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.partNumber} [${it.machineModel || 'OEM'}] — ${it.quantity} pcs`
      )
      .join('\n');
    const msg = `Hello! Request (WAIT FOR RFQ) for specification:\n${list}\n\nContact: ${contact}`;
    return `https://wa.me/447426826595?text=${encodeURIComponent(msg)}`;
  };

  const getWhatsAppLink = () => {
    if (!calculation) return 'https://wa.me/447426826595';
    const msg = `Hello! Confirming order ${calculation.invoiceNumber} for ${calculation.items.length} items. Total: £${calculation.total}. Contact: ${contact}`;
    return `https://wa.me/447426826595?text=${encodeURIComponent(msg)}`;
  };

  const resetForm = () => {
    setStatus('idle');
    setCalculation(null);
    setItems([{ id: '1', partNumber: '', machineModel: '', quantity: '1' }]);
    setCountry(isUk ? 'Україна' : 'Ukraine');
    setContact('');
  };

  return (
    <section id="parts-calculator" className="py-24 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800 scroll-mt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-slate-300 text-xs sm:text-sm font-semibold mb-4 border border-slate-800">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>{isUk ? 'B2B Розрахунок специфікацій (до 10 позицій)' : 'Multi-Item B2B Procurement Portal (up to 10 parts)'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            {t?.rfq?.title || (isUk ? 'Розрахунок вартості замовлення' : 'Instant Order Calculation')}
          </h2>
          <p className="text-base sm:lg text-slate-400 max-w-2xl mx-auto">
            {isUk
              ? 'Додавайте до 10 артикулів в одну заявку. Агент сканує склади в реальному часі та об’єднує доставку Nova Post в один збірний вантаж.'
              : 'Add up to 10 OEM parts to a single proforma invoice with consolidated UK airfreight.'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {status === 'searching' ? (
            <div className="py-16 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-slate-700 border-t-white animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className="w-7 h-7 text-white animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {isUk ? 'Перевірка специфікації по складах UK та Європи...' : 'Querying Stocks for Multiple Items...'}
                </h3>
                <p className="text-sm font-mono text-emerald-400 max-w-md mx-auto transition-all">
                  {searchStep}
                </p>
              </div>

              <div className="max-w-xs mx-auto bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div className="bg-white h-full w-full animate-pulse" />
              </div>
            </div>
          ) : status === 'wait_for_rfq' ? (
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <span className="inline-block bg-slate-800 border border-slate-700 text-amber-400 text-xs uppercase font-mono font-bold px-3 py-1 rounded-full mb-3">
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
                <div className="text-slate-400 font-bold mb-2">
                  {isUk ? `Запитані деталі (${items.length} поз.):` : `Requested Parts (${items.length} items):`}
                </div>
                {items.map((it, idx) => (
                  <div key={it.id} className="flex justify-between text-slate-300 border-b border-slate-800/60 pb-1">
                    <span>
                      {idx + 1}. <strong>{it.partNumber || '—'}</strong> ({it.machineModel || 'OEM'})
                    </span>
                    <span className="font-mono text-white">
                      {it.quantity} {isUk ? 'шт' : 'pcs'}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-slate-400 pt-2">
                  <span>{isUk ? 'Контакт:' : 'Contact:'}</span>
                  <span className="text-white">{contact}</span>
                </div>
              </div>

              <div className="space-y-3 max-w-md mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <a
                    href={getWaitWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl shadow-md transition-all text-xs cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href="https://t.me/+447426826595"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-[#229ED9] hover:bg-[#1d87b9] text-white font-bold py-2.5 px-3 rounded-xl shadow-md transition-all text-xs cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </a>

                  <a
                    href="viber://chat?number=%2B447426826595"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-[#7360F2] hover:bg-[#6350e0] text-white font-bold py-2.5 px-3 rounded-xl shadow-md transition-all text-xs cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Viber</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium py-2 px-4 rounded-xl transition-colors cursor-pointer text-xs"
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
                      {isUk
                        ? `Рахунок сформовано (${calculation.items.length} позицій)`
                        : `Proforma Invoice Ready (${calculation.items.length} items)`}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Ref: {calculation.invoiceNumber} • {calculation.invoiceDate}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePrintIsolated}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer active:scale-95"
                >
                  <Printer className="w-4 h-4 text-slate-300" />
                  <span>{isUk ? 'Друкувати / PDF' : 'Print / PDF'}</span>
                </button>
              </div>

              {/* БЛАНК ІНВОЙСУ */}
              <div id="printable-invoice" className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 mb-8 font-sans">
                <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-5 mb-5 gap-4">
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
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      {isUk ? 'Рахунок №:' : 'Invoice Ref:'}
                    </span>
                    <strong className="text-slate-900 font-mono">{calculation.invoiceNumber}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">
                      {isUk ? 'Покупець / Consignee:' : 'Customer / Consignee:'}
                    </span>
                    <p className="font-semibold text-slate-900">
                      {contact || (isUk ? 'Приватний замовник' : 'Direct Customer')}
                    </p>
                    <p className="text-slate-600">
                      {isUk ? 'Країна доставки:' : 'Destination Country:'} {country}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">
                      {isUk ? 'Логістична консолідація:' : 'Freight Consolidation:'}
                    </span>
                    <p className="text-slate-600">
                      {isUk ? 'Маршрут:' : 'Route:'} <strong>Coventry Hub ➔ {country}</strong>
                    </p>
                    <p className="text-slate-600">
                      {isUk ? 'Формат:' : 'Package:'} <strong>{calculation.parcelTypeLabel}</strong>
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                        <th className="py-2">#</th>
                        <th className="py-2">{isUk ? 'Найменування та Бренд' : 'Description / Brand'}</th>
                        <th className="py-2">{isUk ? 'Артикул OEM' : 'OEM Part Number'}</th>
                        <th className="py-2 text-center">{isUk ? 'К-сть' : 'Qty'}</th>
                        <th className="py-2 text-right">{isUk ? 'Ціна (£)' : 'Unit Price (£)'}</th>
                        <th className="py-2 text-right">{isUk ? 'Сума (£)' : 'Total (£)'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {calculation.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="py-3 text-slate-400">{idx + 1}</td>
                          <td className="py-3">
                            <div className="font-semibold text-slate-800">{it.partTitle}</div>
                            {it.machineModel && (
                              <div className="text-[10px] text-slate-500 font-mono uppercase">{it.machineModel}</div>
                            )}
                          </td>
                          <td className="py-3 font-mono font-bold text-slate-900">{it.partNumber}</td>
                          <td className="py-3 text-center">
                            {it.quantity} {isUk ? 'шт' : 'pcs'}
                          </td>
                          <td className="py-3 text-right">£{it.clientUnitPriceGbp.toFixed(2)}</td>
                          <td className="py-3 text-right font-semibold">£{it.itemTotalGbp.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50/70">
                        <td colSpan={4} className="py-3 px-2 font-medium text-slate-700">
                          {isUk
                            ? `Консолідована доставка Nova Post (загальна вага ${calculation.totalWeightKg} кг)`
                            : `Consolidated Nova Post Freight (Total Weight ${calculation.totalWeightKg} kg)`}
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
                    {isUk
                      ? 'Рахунок дійсний 5 банківських днів. 0% UK VAT. Оплата за безготівковим розрахунком (IBAN/SWIFT) або онлайн карткою.'
                      : 'Valid for 5 banking days. Zero-rated 0% UK Export VAT. Payable via IBAN/SWIFT BACS or online card.'}
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 uppercase font-bold block">
                      {isUk ? 'Разом до сплати:' : 'Total Amount Due:'}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-slate-950">
                      £{calculation.total.toFixed(2)}
                    </div>
                    <div className="text-xs font-bold text-slate-600">
                      ≈ {getUahTotal()} {isUk ? 'грн' : 'UAH'}
                    </div>
                  </div>
                </div>
              </div>

              {/* КНОПКИ ДІЙ */}
              <div className="max-w-md mx-auto space-y-3 mb-6">
                <button
                  type="button"
                  onClick={handleOnlinePayment}
                  disabled={paying}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm sm:text-base transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-70"
                >
                  {paying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{isUk ? 'Відкриття захищеного шлюзу...' : 'Connecting to Stripe Checkout...'}</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>
                        {isUk
                          ? `Оплатити онлайн усю специфікацію: £${calculation.total.toFixed(2)}`
                          : `Pay Full Specification Online: £${calculation.total.toFixed(2)}`}
                      </span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isUk
                      ? 'Захищений платіж UK 3D-Secure • Apple Pay • Google Pay • Visa / MC'
                      : 'Protected UK 3D-Secure Payment • Apple Pay • Google Pay • Visa / MC'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePrintIsolated}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>
                    {isUk ? 'Зберегти офіційний інвойс (PDF)' : 'Download Proforma Invoice (PDF)'}
                  </span>
                </button>
              </div>

              {/* МЕСЕНДЖЕРИ */}
              <div className="space-y-4 max-w-md mx-auto text-center border-t border-slate-800 pt-6">
                <p className="text-xs text-slate-400">
                  {isUk
                    ? 'Або підтвердіть замовлення через офіс у Ковентрі:'
                    : 'Or confirm this order directly with our Coventry hub:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl shadow-md transition-all text-xs cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href="https://t.me/+447426826595"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-[#229ED9] hover:bg-[#1d87b9] text-white font-bold py-2.5 px-3 rounded-xl shadow-md transition-all text-xs cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </a>

                  <a
                    href="viber://chat?number=%2B447426826595"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-[#7360F2] hover:bg-[#6350e0] text-white font-bold py-2.5 px-3 rounded-xl shadow-md transition-all text-xs cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Viber</span>
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
                    {isUk
                      ? `Перелік запчастин (Позиції 1–${items.length} з 10):`
                      : `Part Numbers List (Items 1–${items.length} of 10):`}
                  </span>
                  {items.length < 10 && (
                    <button
                      type="button"
                      onClick={addItem}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isUk ? 'Додати позицію' : 'Add Item'}</span>
                    </button>
                  )}
                </div>

                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl relative space-y-3"
                  >
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                      <span>{isUk ? `Позиція #${index + 1}` : `Item #${index + 1}`}</span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-slate-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                          title={isUk ? 'Видалити' : 'Remove'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] text-slate-400 mb-1">
                          {isUk ? 'Каталожний номер OEM *' : 'OEM Part Number *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={item.partNumber}
                          onChange={(e) => updateItem(item.id, 'partNumber', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 text-white placeholder-slate-500 border border-slate-700 rounded-lg text-sm focus:border-white outline-none font-mono"
                          placeholder={isUk ? 'напр. P535114' : 'e.g. P535114'}
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] text-slate-400 mb-1">
                          {isUk ? 'Техніка / Бренд *' : 'Equipment / Brand *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={item.machineModel}
                          onChange={(e) => updateItem(item.id, 'machineModel', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 text-white placeholder-slate-500 border border-slate-700 rounded-lg text-sm focus:border-white outline-none"
                          placeholder={isUk ? 'напр. Donaldson / JCB' : 'e.g. Donaldson / JCB'}
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] text-slate-400 mb-1">
                          {isUk ? 'Кількість (шт) *' : 'Quantity (pcs) *'}
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 text-white border border-slate-700 rounded-lg text-sm focus:border-white outline-none font-mono"
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
                    {t?.rfq?.form?.country || (isUk ? 'Країна призначення' : 'Country')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 text-white placeholder-slate-500 border border-slate-700 rounded-xl focus:ring-1 focus:ring-slate-500 outline-none text-sm"
                    placeholder={isUk ? 'Україна' : 'Ukraine'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    {t?.rfq?.form?.contact || (isUk ? 'Email або WhatsApp' : 'Contact')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 text-white placeholder-slate-500 border border-slate-700 rounded-xl focus:ring-1 focus:ring-slate-500 outline-none text-sm"
                    placeholder="+380... / email@domain.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'searching'}
                className="w-full bg-white hover:bg-slate-100 text-slate-950 font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-base sm:text-lg disabled:opacity-70 shadow-lg cursor-pointer"
              >
                {status === 'searching' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>
                      {isUk
                        ? 'Сканування та консолідація специфікації...'
                        : 'Scanning & Consolidating Specification...'}
                    </span>
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
