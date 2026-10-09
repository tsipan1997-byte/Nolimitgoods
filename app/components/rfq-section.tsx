'use client';

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, MessageSquare, ArrowRight, Calculator, Truck, FileDown } from 'lucide-react';
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

  // Синхронізація з каталогом деталей та брендами
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

  // Розрахунок вартості та логістики Nova Post
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
      // Працює автономно
    }

    setCalculation(result);
    setStatus('success');
  };

  const getUahTotal = () => {
    if (!calculation) return '0';
    return Math.round(Number(calculation.total) * 56).toLocaleString('uk-UA');
  };

  const getUahShipping = () => {
    if (!calculation) return '0';
    return Math.round(Number(calculation.shippingCost) * 56).toLocaleString('uk-UA');
  };

  const getWhatsAppLink = () => {
    if (!calculation) return 'https://wa.me/447426826595';
    const msg = `Доброго дня! Хочу замовити: ${calculation.part} (${machineModel}) у кількості ${calculation.qty} шт. Замовлення ${calculation.invoiceNumber}. Доставка Nova Post (${calculation.parcelCategory.toUpperCase()}): £${calculation.shippingCost}. Загальна вартість: ~£${calculation.total} (≈ ${getUahTotal()} грн). Мій контакт: ${contact}`;
    return `https://wa.me/447426826595?text=${encodeURIComponent(msg)}`;
  };

  const getViberLink = () => 'viber://chat?number=%2B447426826595';
  const getTelegramLink = () => 'https://t.me/+447426826595';

  // Друк / Збереження офіційного Proforma Invoice (PDF)
  const handleDownloadInvoice = () => {
    if (!calculation) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Proforma Invoice - ${calculation.invoiceNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 40px; color: #0f172a; margin: 0; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #dc2626; padding-bottom: 20px; margin-bottom: 30px; }
          .brand { font-size: 26px; font-weight: 900; color: #0f172a; }
          .brand span { color: #dc2626; }
          .company-info { font-size: 12px; color: #475569; line-height: 1.5; text-align: right; }
          .doc-title { font-size: 20px; font-weight: 800; text-transform: uppercase; margin-bottom: 20px; color: #0f172a; }
          .meta-grid { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 13px; }
          .meta-box { width: 48%; }
          .meta-box h4 { margin: 0 0 6px 0; font-size: 12px; color: #64748b; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
          th { background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left; padding: 12px; font-size: 11px; text-transform: uppercase; color: #475569; }
          td { border-bottom: 1px solid #e2e8f0; padding: 12px; }
          .totals { margin-left: auto; width: 320px; margin-bottom: 40px; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
          .totals-row.grand { border-top: 2px solid #0f172a; font-weight: 900; font-size: 18px; color: #dc2626; padding-top: 10px; margin-top: 6px; }
          .footer-note { font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; line-height: 1.6; }
          .badge { display: inline-block; background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px; margin-bottom: 10px; }
          @media print {
            body { padding: 20px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">NoLimitGoods <span>LTD</span></div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">UK Export & Heavy Machinery Logistics</div>
          </div>
          <div class="company-info">
            <strong>NoLimitGoods Limited</strong><br />
            Company No: 13146899<br />
            VAT: GB 372 6541 87 | EORI: GB079878335000<br />
            374 Hipsell Highway, Coventry, CV2 5FR, United Kingdom<br />
            Email: nolimitgoods@gmail.com | Phone: +44 7426 826595
          </div>
        </div>

        <div class="doc-title">PROFORMA INVOICE / РАХУНОК-ПРОФОРМА</div>
        <div class="badge">UK EXPORT — 0% VAT ZERO-RATED</div>

        <div class="meta-grid">
          <div class="meta-box">
            <h4>Покупець / Consignee:</h4>
            <strong>Клієнт:</strong> ${contact || 'Приватний замовник'}<br />
            <strong>Країна доставки:</strong> ${country}<br />
            <strong>Техніка / Вузол:</strong> ${machineModel || 'Спецтехніка'}
          </div>
          <div class="meta-box" style="text-align: right;">
            <h4>Дані рахунку:</h4>
            <strong>Invoice №:</strong> ${calculation.invoiceNumber}<br />
            <strong>Дата:</strong> ${calculation.invoiceDate}<br />
            <strong>Умови поставки:</strong> CPT / Door-to-Door (Nova Post)
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Опис / Part Description</th>
              <th>Каталожний номер</th>
              <th>К-сть</th>
              <th>Ціна (GBP)</th>
              <th>Сума (GBP)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Оригінальна запасна частина (${machineModel || 'OEM'})</td>
              <td><strong>${calculation.part}</strong></td>
              <td>${calculation.qty} шт</td>
              <td>£${calculation.unitPrice.toFixed(2)}</td>
              <td>£${(calculation.unitPrice * calculation.qty).toFixed(2)}</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Експрес-доставка Nova Post Global (${calculation.parcelCategory.toUpperCase()})</td>
              <td>FREIGHT-UK-UA</td>
              <td>1 рейс</td>
              <td>£${calculation.shippingCost.toFixed(2)}</td>
              <td>£${calculation.shippingCost.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Разом товари (Net):</span>
            <span>£${(calculation.unitPrice * calculation.qty).toFixed(2)}</span>
          </div>
          <div class="totals-row">
            <span>Доставка до дверей:</span>
            <span>£${calculation.shippingCost.toFixed(2)}</span>
          </div>
          <div class="totals-row">
            <span>UK VAT (Експорт 0%):</span>
            <span>£0.00</span>
          </div>
          <div class="totals-row grand">
            <span>РАЗОМ ДО СПЛАТИ:</span>
            <span>£${calculation.total.toFixed(2)}</span>
          </div>
          <div style="font-size: 13px; color: #475569; text-align: right; margin-top: 4px;">
            ≈ ${getUahTotal()} грн (за комерційним курсом)
          </div>
        </div>

        <div class="footer-note">
          <strong>Банківські реквізити та умови оплати:</strong><br />
          Оплата здійснюється у GBP або еквіваленті через SWIFT / SEPA / IBAN або карткою міжнародного зразка. Рахунок виставлено компанією NoLimitGoods Limited згідно з нормами зовнішньоекономічної діяльності Великобританії.<br />
          Термін комплектації та доставки: 5–8 робочих днів з моменту підтвердження.
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
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
              ? 'Введіть номер деталі або оберіть її в каталозі. Тариф Nova Post (Small £27, Medium £41, Large £68) прораховується автоматично з можливістю завантажити Proforma Invoice.'
              : 'Enter part number or choose from catalog. Instant Nova Post UK tariffs & Proforma Invoice generation.'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {status === 'success' && calculation ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full mb-4 border border-emerald-500/30">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {isUk ? 'Розрахунок вартості готовий!' : 'Calculation Completed!'}
              </h3>
              <p className="text-slate-400 mb-6">
                {isUk ? 'Номер рахунку:' : 'Invoice Ref:'}{' '}
                <strong className="text-amber-400 font-mono">{calculation.invoiceNumber}</strong> • {calculation.part} {machineModel && `(${machineModel})`}
              </p>

              {/* Картка підсумку */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 max-w-md mx-auto mb-6 shadow-inner text-left">
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
                  {isUk ? 'Офіційний експорт: 0% UK VAT, повний пакет митних документів T1.' : '0% UK Export VAT compliant.'}
                </div>
              </div>

              {/* Кнопка завантаження офіційного Proforma Invoice */}
              <div className="max-w-md mx-auto mb-6">
                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-bold text-sm transition-all shadow-md cursor-pointer active:scale-95 group"
                >
                  <FileDown className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                  <span>{isUk ? '📄 Завантажити рахунок-проформу (PDF)' : '📄 Download Proforma Invoice (PDF)'}</span>
                </button>
              </div>

              {/* Месенджери */}
              <div className="space-y-4 max-w-md mx-auto">
                <p className="text-sm font-bold text-slate-300">
                  {isUk ? 'Підтвердіть замовлення в один клік:' : 'Confirm order via messenger:'}
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
                  className="w-full bg-slate-900 hover:bg-slate-800 text-slate-400 font-semibold py-3 px-6 rounded-xl transition-colors cursor-pointer text-sm mt-3"
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
