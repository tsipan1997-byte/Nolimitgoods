'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ArrowRight,
  Calculator,
  Loader2,
  Search,
  Box,
  Clock,
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

export default function RFQSection() {
  const { t, language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const [items, setItems] = useState<RFQItemInput[]>([
    { id: '1', partNumber: '', machineModel: '', quantity: '1' },
  ]);
  const [comment, setComment] = useState('');
  const [country, setCountry] = useState(isUk ? 'Україна' : 'Ukraine');
  const [contact, setContact] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [showCountry, setShowCountry] = useState(false);

  const [status, setStatus] = useState<any>('idle');
  const [searchStep, setSearchStep] = useState<string>('');

  const triggerGoogleConversion = (url?: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: 'AW-670192610/Sx8lCIG5m54dEOKnyb8C',
        event_callback: function () {
          if (url) {
            window.location.href = url;
          }
        },
      });
    } else if (url) {
      window.location.href = url;
    }
  };

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
    if (items.length <= 1) {
      setItems([{ id: '1', partNumber: '', machineModel: '', quantity: '1' }]);
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const updateItem = (id: string, field: keyof RFQItemInput, val: string) => {
    setItems((prev) => {
      const next = prev.map((it) => (it.id === id ? { ...it, [field]: val } : it));
      const currentIndex = prev.findIndex((it) => it.id === id);

      // Автоматичне додавання наступного рядка при введенні в останній рядок
      if (
        field === 'partNumber' &&
        currentIndex === prev.length - 1 &&
        val.trim().length > 0 &&
        prev.length < 10
      ) {
        return [
          ...next,
          { id: String(Date.now()), partNumber: '', machineModel: '', quantity: '1' },
        ];
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeItems = items.filter((it) => it.partNumber.trim() !== '');

    if (activeItems.length === 0 && !comment.trim()) {
      alert(
        isUk
          ? 'Вкажіть хоча б один каталожний номер або напишіть список деталей у повідомленні.'
          : 'Please enter at least one part number or paste your list in the message box.'
      );
      return;
    }

    if (!contact.trim()) {
      alert(
        isUk
          ? 'Вкажіть ваш телефон, Email або месенджер для зв’язку.'
          : 'Please provide your contact information (phone, email or messenger).'
      );
      return;
    }

    setStatus('searching');

    const invNum = `NLG-PI-${Math.floor(100000 + Math.random() * 900000)}`;

    setSearchStep(
      isUk
        ? '1/2 Перевірка наявності деталей на офіційних складах...'
        : '1/2 Checking live inventory across authorized distributor stocks...'
    );

    try {
      await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: activeItems.map((it) => ({
            partNumber: it.partNumber.trim(),
            machineModel: it.machineModel.trim(),
            quantity: Math.max(1, parseInt(it.quantity, 10) || 1),
          })),
          country,
          contact: contact.trim(),
          comment: comment.trim(),
          invoiceNumber: invNum,
        }),
      });

      setSearchStep(
        isUk
          ? '2/2 Передаємо запит нашому фахівцю...'
          : '2/2 Sending your request to our specialist...'
      );
    } catch (err) {
      console.error('RFQ error:', err);
    }

    // Подія Lead для Meta (Facebook) Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'RFQ',
        num_items: activeItems.length,
      });
    }

    // Інвойс більше не показуємо: завжди повідомляємо, що фахівець зв'яжеться
    setStatus('wait_for_rfq');
    triggerGoogleConversion();
  };

  const getWaitWhatsAppLink = () => {
    const activeItems = items.filter((it) => it.partNumber.trim() !== '');
    const list = activeItems
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.partNumber} [${it.machineModel || 'OEM'}] — ${it.quantity} pcs`
      )
      .join('\n');
    const msg = `Добрий день! Запит на розрахунок деталей:\n${list || 'Список вказано в коментарі'}${
      comment ? `\n\nКоментар: ${comment}` : ''
    }\n\nКонтакт: ${contact}`;
    return `https://wa.me/447426826595?text=${encodeURIComponent(msg)}`;
  };

  const resetForm = () => {
    setStatus('idle');
    setItems([{ id: '1', partNumber: '', machineModel: '', quantity: '1' }]);
    setComment('');
    setCountry(isUk ? 'Україна' : 'Ukraine');
    setContact('');
    setShowComment(false);
    setShowCountry(false);
  };

  const activeCount = items.filter((it) => it.partNumber.trim() !== '').length;

  return (
    <section
      id="parts-calculator"
      className="py-24 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800 scroll-mt-20"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-slate-300 text-xs sm:text-sm font-semibold mb-4 border border-slate-800">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>
              {isUk
                ? 'B2B Розрахунок специфікацій (до 10 позицій)'
                : 'Multi-Item B2B Procurement Portal (up to 10 parts)'}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            {t?.rfq?.title || (isUk ? 'Розрахунок вартості замовлення' : 'Instant Order Calculation')}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            {isUk
              ? 'Введіть один або кілька OEM-номерів (нове поле відкриється автоматично) або додайте список деталей текстом.'
              : 'Add up to 10 OEM parts to a single request. Our specialist will contact you with pricing.'}
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
                  {isUk ? 'Обробка запиту...' : 'Processing your request...'}
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
              <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-block bg-slate-800 border border-slate-700 text-emerald-400 text-xs uppercase font-mono font-bold px-3 py-1 rounded-full mb-3">
                  {isUk ? 'ЗАПИТ ПРИЙНЯТО' : 'INQUIRY RECEIVED'}
                </span>
                <h3 className="text-2xl font-black text-white mb-2">
                  {isUk ? 'Специфікацію передано в обробку' : 'Transferred to Processing'}
                </h3>
                <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  {isUk
                    ? 'Наш фахівець зв’яжеться з вами для надання інформації.'
                    : 'Our specialist will contact you to provide the information.'}
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="text-slate-400 font-bold mb-2">
                  {isUk
                    ? `Запитані деталі (${activeCount > 0 ? activeCount : 1} поз.):`
                    : `Requested Parts (${activeCount > 0 ? activeCount : 1} items):`}
                </div>
                {items
                  .filter((it) => it.partNumber.trim() !== '')
                  .map((it, idx) => (
                    <div
                      key={it.id}
                      className="flex justify-between text-slate-300 border-b border-slate-800/60 pb-1"
                    >
                      <span>
                        {idx + 1}. <strong>{it.partNumber || '—'}</strong> ({it.machineModel || 'OEM'})
                      </span>
                      <span className="font-mono text-white">
                        {it.quantity} {isUk ? 'шт' : 'pcs'}
                      </span>
                    </div>
                  ))}
                {comment && (
                  <div className="pt-2 text-slate-400 border-b border-slate-800/60 pb-2">
                    <span className="block font-semibold text-slate-300 mb-0.5">
                      {isUk ? 'Повідомлення:' : 'Comment:'}
                    </span>
                    <span className="whitespace-pre-wrap">{comment}</span>
                  </div>
                )}
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
                    onClick={() => triggerGoogleConversion()}
                    className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl shadow-md transition-all text-xs cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href="https://t.me/+447426826595"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerGoogleConversion()}
                    className="flex items-center justify-center gap-1.5 bg-[#229ED9] hover:bg-[#1d87b9] text-white font-bold py-2.5 px-3 rounded-xl shadow-md transition-all text-xs cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </a>

                  <a
                    href="viber://chat?number=%2B447426826595"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerGoogleConversion()}
                    className="flex items-center justify-center gap-1.5 bg-[#7360F2] hover:bg-[#6350e0] text-white font-bold py-2.5 px-3 rounded-xl shadow-md transition-all text-xs cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Viber</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 px-4 rounded-xl transition-colors cursor-pointer text-xs"
                >
                  {isUk ? 'Новий запит' : 'New Request'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    {isUk ? 'Які деталі потрібні?' : 'Which parts do you need?'}
                  </span>
                  {items.length < 10 && (
                    <button
                      type="button"
                      onClick={addItem}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isUk ? 'Ще деталь' : 'Add part'}</span>
                    </button>
                  )}
                </div>

                {items.map((item, index) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-2">
                      <input
                        type="text"
                        value={item.partNumber}
                        onChange={(e) => updateItem(item.id, 'partNumber', e.target.value)}
                        className="sm:col-span-2 w-full px-3 py-3 bg-slate-950 text-white placeholder-slate-500 border border-slate-700 rounded-xl text-sm focus:border-white outline-none font-mono uppercase"
                        placeholder={
                          index === 0
                            ? isUk
                              ? 'Артикул OEM, напр. 281-1196 *'
                              : 'OEM part number, e.g. 281-1196 *'
                            : isUk
                            ? 'Наступний артикул'
                            : 'Next part number'
                        }
                        aria-label={isUk ? 'Каталожний номер OEM' : 'OEM Part Number'}
                      />
                      <input
                        type="text"
                        value={item.machineModel}
                        onChange={(e) => updateItem(item.id, 'machineModel', e.target.value)}
                        className="sm:col-span-2 w-full px-3 py-3 bg-slate-950 text-white placeholder-slate-500 border border-slate-700 rounded-xl text-sm focus:border-white outline-none"
                        placeholder={isUk ? 'Бренд / техніка (необов’язково)' : 'Brand / machine (optional)'}
                        aria-label={isUk ? 'Техніка / Бренд' : 'Equipment / Brand'}
                      />
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                        className="sm:col-span-1 w-full px-3 py-3 bg-slate-950 text-white border border-slate-700 rounded-xl text-sm focus:border-white outline-none font-mono text-center"
                        placeholder="1"
                        aria-label={isUk ? 'Кількість' : 'Quantity'}
                      />
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-slate-500 hover:text-red-400 p-3 transition-colors cursor-pointer"
                        title={isUk ? 'Видалити' : 'Remove'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Коментар / список текстом: згорнуто */}
                {!showComment ? (
                  <button
                    type="button"
                    onClick={() => setShowComment(true)}
                    className="text-xs text-slate-400 hover:text-white underline underline-offset-4 cursor-pointer"
                  >
                    {isUk
                      ? '+ Додати коментар або вставити список деталей текстом'
                      : '+ Add a comment or paste a parts list'}
                  </button>
                ) : (
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={
                      isUk
                        ? 'Вставте список деталей, VIN-код або модель машини...'
                        : 'Paste your parts list, VIN number or machine model here...'
                    }
                    className="w-full px-4 py-3 bg-slate-950 text-white placeholder-slate-500 border border-slate-700 rounded-xl focus:ring-1 focus:ring-slate-500 outline-none text-sm resize-none"
                  />
                )}
              </div>

              {/* Контакт: єдине обов'язкове поле крім артикулу */}
              <div className="mb-3">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  {isUk ? 'Телефон, Telegram, Viber або Email *' : 'Phone, Telegram, Viber or Email *'}
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-950 text-white placeholder-slate-500 border border-slate-700 rounded-xl focus:ring-1 focus:ring-slate-500 outline-none text-base"
                  placeholder="+380... / @username / email@domain.com"
                />
              </div>

              {/* Країна: за замовчуванням Україна, змінити можна за бажанням */}
              <div className="mb-6 text-xs text-slate-400">
                {!showCountry ? (
                  <span>
                    {isUk ? 'Доставка: ' : 'Delivery to: '}
                    <strong className="text-slate-300">{country}</strong>{' '}
                    <button
                      type="button"
                      onClick={() => setShowCountry(true)}
                      className="underline underline-offset-4 hover:text-white cursor-pointer"
                    >
                      {isUk ? 'змінити країну' : 'change country'}
                    </button>
                  </span>
                ) : (
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 text-white placeholder-slate-500 border border-slate-700 rounded-xl focus:ring-1 focus:ring-slate-500 outline-none text-sm"
                    placeholder={isUk ? 'Країна призначення' : 'Destination country'}
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={status === 'searching'}
                className="w-full bg-white hover:bg-slate-100 text-slate-950 font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-base sm:text-lg disabled:opacity-70 shadow-lg cursor-pointer"
              >
                {status === 'searching' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{isUk ? 'Обробка запиту...' : 'Processing Inquiry...'}</span>
                  </>
                ) : (
                  <>
                    <Box className="w-5 h-5" />
                    <span>
                      {isUk
                        ? `Дізнатися ціну (${activeCount > 0 ? activeCount : 1} поз.)`
                        : `Get a Quote (${activeCount > 0 ? activeCount : 1} Items)`}
                    </span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-slate-500 mt-3">
                {isUk
                  ? 'Безкоштовно і без зобовʼязань. Ми звʼяжемося з вами з ціною та термінами.'
                  : 'Free and no obligation. We will contact you with pricing and lead time.'}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
