'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  MessageSquare,
  ArrowRight,
  Loader2,
  Plus,
  Trash2,
  Camera,
  X,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  Calculator,
  Truck,
  BadgeCheck,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface RFQItemInput {
  id: string;
  partNumber: string;
  machineModel: string;
  quantity: string;
}

interface PhotoItem {
  id: string;
  file: File;
  preview: string;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

const WHATSAPP_NUMBER = '447426826595';
const MAX_ITEMS = 10;
const MAX_PHOTOS = 3;

const emptyItem = (): RFQItemInput => ({
  id: String(Date.now() + Math.random()),
  partNumber: '',
  machineModel: '',
  quantity: '1',
});

// Стискаємо фото на телефоні перед відправкою: ~1600px, JPEG.
// Так 3 фото гарантовано влазять у ліміт сервера і швидко відправляються з мобільного інтернету.
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  try {
    const url = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    const maxSide = 1600;
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82));
    if (!blob) return file;
    const name = (file.name || 'photo').replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], name, { type: 'image/jpeg' });
  } catch {
    // Формат, який браузер не вміє відкрити (напр. HEIC на старому Android) — шлемо як є
    return file;
  }
}

export default function RFQSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const [items, setItems] = useState<RFQItemInput[]>([emptyItem()]);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [partTypes, setPartTypes] = useState<string[]>([]);
  const [country, setCountry] = useState(isUk ? 'Україна' : 'Ukraine');
  const [showCountry, setShowCountry] = useState(false);
  const [contact, setContact] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState('');
  const [leadId, setLeadId] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  const PART_TYPE_OPTIONS = isUk
    ? ['Оригінал', 'Аналог', 'Б/у']
    : ['Genuine OEM', 'Aftermarket', 'Used'];

  // Клік по артикулу в каталозі брендів підставляє його у форму
  useEffect(() => {
    const onSelect = (e: Event) => {
      const { oem, brand } = (e as CustomEvent).detail || {};
      if (!oem) return;
      setItems((prev) => {
        const firstEmpty = prev.findIndex((it) => !it.partNumber.trim());
        const next = [...prev];
        if (firstEmpty >= 0) {
          next[firstEmpty] = { ...next[firstEmpty], partNumber: oem, machineModel: brand || '' };
        } else if (next.length < MAX_ITEMS) {
          next.push({ ...emptyItem(), partNumber: oem, machineModel: brand || '' });
        }
        return next;
      });
      setStatus('idle');
      document.getElementById('parts-calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => contactRef.current?.focus({ preventScroll: true }), 600);
    };
    window.addEventListener('nlg:select-part', onSelect);
    return () => window.removeEventListener('nlg:select-part', onSelect);
  }, []);

  // Прибираємо прев'ю фото з пам'яті
  useEffect(() => {
    return () => photos.forEach((p) => URL.revokeObjectURL(p.preview));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateItem = (id: string, field: keyof RFQItemInput, val: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === id);
      const next = prev.map((it) => (it.id === id ? { ...it, [field]: val } : it));
      // Новий рядок відкривається сам, коли починаєш писати в останній
      if (field === 'partNumber' && idx === prev.length - 1 && val.trim() && prev.length < MAX_ITEMS) {
        next.push(emptyItem());
      }
      return next;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => (prev.length <= 1 ? [emptyItem()] : prev.filter((it) => it.id !== id)));
  };

  const addPhotos = async (files: FileList | null) => {
    if (!files) return;
    const free = MAX_PHOTOS - photos.length;
    const picked = Array.from(files).slice(0, free);
    const prepared: PhotoItem[] = [];
    for (const f of picked) {
      const compressed = await compressImage(f);
      prepared.push({
        id: String(Date.now() + Math.random()),
        file: compressed,
        preview: URL.createObjectURL(compressed),
      });
    }
    setPhotos((prev) => [...prev, ...prepared].slice(0, MAX_PHOTOS));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const p = prev.find((x) => x.id === id);
      if (p) URL.revokeObjectURL(p.preview);
      return prev.filter((x) => x.id !== id);
    });
  };

  const togglePartType = (t: string) => {
    setPartTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  // Звідки прийшла людина: UTM-мітки реклами та сайт-джерело
  const getSource = () => {
    if (typeof window === 'undefined') return '';
    try {
      const params = new URLSearchParams(window.location.search);
      const parts: string[] = [];
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
        const v = params.get(k);
        if (v) parts.push(`${k}=${v}`);
      });
      if (params.get('fbclid')) parts.push('fbclid=yes');
      if (params.get('gclid')) parts.push('gclid=yes');
      if (document.referrer) {
        try {
          parts.push(`ref=${new URL(document.referrer).hostname}`);
        } catch {
          // некоректний referrer
        }
      }
      return parts.join(' | ');
    } catch {
      return '';
    }
  };

  const activeItems = items.filter((it) => it.partNumber.trim() !== '');

  const trackConversion = () => {
    if (typeof window === 'undefined') return;
    const w = window as any;
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'conversion', { send_to: 'AW-670192610/Sx8lCIG5m54dEOKnyb8C' });
    }
    if (typeof w.fbq === 'function') {
      w.fbq('track', 'Lead', { content_name: 'RFQ', num_items: activeItems.length });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (activeItems.length === 0 && !comment.trim() && photos.length === 0) {
      setFormError(
        isUk
          ? 'Вкажіть артикул, напишіть VIN / модель техніки або додайте фото деталі.'
          : 'Enter a part number, describe the part (VIN / machine model) or add a photo.'
      );
      return;
    }
    if (!contact.trim()) {
      setFormError(
        isUk ? 'Вкажіть телефон, Telegram, Viber або Email — щоб ми надіслали ціну.' : 'Please add your phone, messenger or email.'
      );
      contactRef.current?.focus();
      return;
    }

    const id = `NLG-${Date.now().toString().slice(-6)}`;
    setLeadId(id);
    setStatus('sending');

    const fd = new FormData();
    fd.append('leadId', id);
    fd.append('contact', contact.trim());
    fd.append('comment', comment.trim());
    fd.append('country', country.trim());
    fd.append('partType', partTypes.length ? partTypes.join(', ') : isUk ? 'Всі варіанти' : 'Any');
    fd.append('source', getSource());
    fd.append('page', typeof window !== 'undefined' ? window.location.pathname : '');
    fd.append('website_hp', honeypot);
    fd.append(
      'items',
      JSON.stringify(
        activeItems.map((it) => ({
          partNumber: it.partNumber.trim(),
          machineModel: it.machineModel.trim(),
          quantity: Math.max(1, parseInt(it.quantity, 10) || 1),
        }))
      )
    );
    photos.forEach((p) => fd.append('photos', p.file, p.file.name));

    try {
      const res = await fetch('/api/lead', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Автоматичний підбір цін по артикулах — окремим повідомленням менеджеру.
      // Йде у фоні, на заявку клієнта ніяк не впливає.
      if (activeItems.length > 0) {
        fetch('/api/rfq', {
          method: 'POST',
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: activeItems.map((it) => ({
              partNumber: it.partNumber.trim(),
              machineModel: it.machineModel.trim(),
              quantity: Math.max(1, parseInt(it.quantity, 10) || 1),
            })),
            country,
            contact: contact.trim(),
            invoiceNumber: id,
          }),
        }).catch(() => {});
      }

      trackConversion();
      setStatus('success');
    } catch (err) {
      console.error('Lead submit error:', err);
      setStatus('error');
    }
  };

  const whatsappLink = () => {
    const list = activeItems
      .map((it, i) => `${i + 1}. ${it.partNumber}${it.machineModel ? ` (${it.machineModel})` : ''} — ${it.quantity} шт`)
      .join('\n');
    const msg =
      `Добрий день! Запит на процінку${leadId ? ` ${leadId}` : ''}:\n` +
      (list || '') +
      (comment.trim() ? `\n${comment.trim()}` : '') +
      (partTypes.length ? `\nЦікавить: ${partTypes.join(', ')}` : '') +
      `\nДоставка: ${country}\nКонтакт: ${contact}` +
      (photos.length ? `\n(фото надішлю тут)` : '');
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const resetForm = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.preview));
    setItems([emptyItem()]);
    setComment('');
    setPhotos([]);
    setPartTypes([]);
    setContact('');
    setFormError('');
    setLeadId('');
    setStatus('idle');
  };

  const steps = isUk
    ? [
        { icon: FileSearch, title: 'Надсилаєте запит', text: 'Артикул, VIN, фото або цілий список' },
        { icon: Calculator, title: 'Рахуємо варіанти', text: 'Оригінал, аналог і б/у з цінами та термінами' },
        { icon: Truck, title: 'Привозимо', text: 'Фотозвіт перед відправкою, доставка в Україну' },
      ]
    : [
        { icon: FileSearch, title: 'Send a request', text: 'Part number, VIN, photo or a full list' },
        { icon: Calculator, title: 'We quote options', text: 'Genuine, aftermarket and used, with prices and lead times' },
        { icon: Truck, title: 'We deliver', text: 'Photo report before dispatch, door-to-door delivery' },
      ];

  const messengerButtons = (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-3 rounded-xl transition-all text-sm active:scale-95"
      >
        <MessageSquare className="w-4 h-4" />
        <span>WhatsApp</span>
      </a>
      <a
        href="https://t.me/+447426826595"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 bg-[#229ED9] hover:bg-[#1d87b9] text-white font-bold py-3 px-3 rounded-xl transition-all text-sm active:scale-95"
      >
        <MessageSquare className="w-4 h-4" />
        <span>Telegram</span>
      </a>
      <a
        href="viber://chat?number=%2B447426826595"
        className="flex items-center justify-center gap-1.5 bg-[#7360F2] hover:bg-[#6350e0] text-white font-bold py-3 px-3 rounded-xl transition-all text-sm active:scale-95"
      >
        <MessageSquare className="w-4 h-4" />
        <span>Viber</span>
      </a>
    </div>
  );

  return (
    <section
      id="parts-calculator"
      className="py-20 sm:py-24 bg-white text-slate-900 relative overflow-hidden border-b border-slate-200 scroll-mt-20"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-slate-600 text-xs sm:text-sm font-semibold mb-4 border border-slate-200">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            <span>{isUk ? 'Безкоштовна процінка, без зобовʼязань' : 'Free quote, no obligation'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {isUk ? 'Дізнатися ціну на запчастини' : 'Get a Price for Your Parts'}
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">
            {isUk
              ? 'Не знаєте артикул? Напишіть VIN або модель техніки чи додайте фото деталі — підберемо самі.'
              : "Don't know the part number? Add a VIN, machine model or a photo — we'll identify it."}
          </p>
        </div>

        {/* Як це працює */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {steps.map((s, i) => (
            <div key={s.title} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200">
              <div className="shrink-0 w-9 h-9 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center">
                <s.icon className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-900">
                  {i + 1}. {s.title}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 leading-snug">{s.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-10 shadow-2xl">
          {status === 'success' ? (
            <div className="py-6 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="inline-block bg-slate-100 border border-slate-300 text-emerald-600 text-xs uppercase font-mono font-bold px-3 py-1 rounded-full mb-3">
                  {isUk ? `Запит ${leadId} прийнято` : `Request ${leadId} received`}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  {isUk ? 'Дякуємо! Запит уже в менеджера' : 'Thank you! Your request is with our team'}
                </h3>
                <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  {isUk
                    ? `Звʼяжемося з вами (${contact}) з цінами та термінами. Якщо зручніше — напишіть нам у месенджер, вказавши номер ${leadId}.`
                    : `We'll contact you (${contact}) with prices and lead times. You can also message us quoting ${leadId}.`}
                </p>
              </div>

              {(activeItems.length > 0 || photos.length > 0) && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 max-w-md mx-auto text-left text-xs space-y-2">
                  {activeItems.map((it, idx) => (
                    <div key={it.id} className="flex justify-between text-slate-600 border-b border-slate-200 pb-1">
                      <span>
                        {idx + 1}. <strong className="font-mono">{it.partNumber}</strong>
                        {it.machineModel ? ` (${it.machineModel})` : ''}
                      </span>
                      <span className="font-mono text-slate-900">
                        {it.quantity} {isUk ? 'шт' : 'pcs'}
                      </span>
                    </div>
                  ))}
                  {photos.length > 0 && (
                    <div className="text-slate-500">
                      📷 {isUk ? `Фото: ${photos.length} шт.` : `Photos: ${photos.length}`}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3 max-w-md mx-auto">
                {messengerButtons}
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
                >
                  {isUk ? 'Надіслати ще один запит' : 'Send another request'}
                </button>
              </div>
            </div>
          ) : status === 'error' ? (
            <div className="py-6 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  {isUk ? 'Не вдалося надіслати з сайту' : "Couldn't send from the website"}
                </h3>
                <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  {isUk
                    ? 'Нічого не втрачено: натисніть WhatsApp — запит уже заповнений, лишиться тільки надіслати.'
                    : 'Nothing is lost: tap WhatsApp — your request is pre-filled, just press send.'}
                </p>
              </div>
              <div className="space-y-3 max-w-md mx-auto">
                {messengerButtons}
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
                >
                  {isUk ? 'Спробувати ще раз' : 'Try again'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* 1. Артикули */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                    {isUk ? 'Артикул (якщо знаєте)' : 'Part number (if known)'}
                  </span>
                  {items.length < MAX_ITEMS && (
                    <button
                      type="button"
                      onClick={() => setItems((p) => [...p, emptyItem()])}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isUk ? 'Ще деталь' : 'Add part'}</span>
                    </button>
                  )}
                </div>

                {items.map((item, index) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <div className="flex-1 grid grid-cols-6 sm:grid-cols-5 gap-2">
                      <input
                        type="text"
                        value={item.partNumber}
                        onChange={(e) => updateItem(item.id, 'partNumber', e.target.value)}
                        className="col-span-6 sm:col-span-2 w-full px-3 py-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-xl text-base sm:text-sm focus:border-red-500 outline-none font-mono uppercase"
                        placeholder={
                          index === 0 ? (isUk ? 'Напр. 281-1196' : 'e.g. 281-1196') : isUk ? 'Наступний артикул' : 'Next part number'
                        }
                        aria-label={isUk ? 'Каталожний номер' : 'Part number'}
                      />
                      <input
                        type="text"
                        value={item.machineModel}
                        onChange={(e) => updateItem(item.id, 'machineModel', e.target.value)}
                        className="col-span-4 sm:col-span-2 w-full px-3 py-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-xl text-base sm:text-sm focus:border-red-500 outline-none"
                        placeholder={isUk ? 'Бренд / техніка' : 'Brand / machine'}
                        aria-label={isUk ? 'Бренд або техніка' : 'Brand or machine'}
                      />
                      <input
                        type="number"
                        min="1"
                        inputMode="numeric"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                        className="col-span-2 sm:col-span-1 w-full px-3 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl text-base sm:text-sm focus:border-red-500 outline-none font-mono text-center"
                        aria-label={isUk ? 'Кількість' : 'Quantity'}
                      />
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-slate-500 hover:text-red-600 p-3 transition-colors"
                        title={isUk ? 'Видалити' : 'Remove'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* 2. VIN / опис / список + фото */}
              <div className="mb-6 space-y-3">
                <span className="block text-xs uppercase font-bold tracking-wider text-slate-500">
                  {isUk ? 'Або опишіть, що треба' : 'Or describe what you need'}
                </span>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    isUk
                      ? 'VIN або серійний номер, модель техніки, рік — чи вставте цілий список деталей з дефектовки'
                      : 'VIN or serial number, machine model, year — or paste your full parts list'
                  }
                  className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-xl focus:border-red-500 outline-none text-base sm:text-sm resize-y"
                />

                <div className="flex flex-wrap items-center gap-3">
                  {photos.map((p) => (
                    <div key={p.id} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-300 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.preview} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(p.id)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center"
                        aria-label={isUk ? 'Прибрати фото' : 'Remove photo'}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {photos.length < MAX_PHOTOS && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-900 text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors"
                    >
                      <Camera className="w-4 h-4 text-amber-600" />
                      <span>
                        {isUk
                          ? `Фото деталі або шильдика${photos.length ? ` (${photos.length}/${MAX_PHOTOS})` : ''}`
                          : `Photo of part or nameplate${photos.length ? ` (${photos.length}/${MAX_PHOTOS})` : ''}`}
                      </span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => addPhotos(e.target.files)}
                  />
                </div>
              </div>

              {/* 3. Що цікавить */}
              <div className="mb-6">
                <span className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">
                  {isUk ? 'Що рахувати' : 'What to quote'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {PART_TYPE_OPTIONS.map((t) => {
                    const on = partTypes.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => togglePartType(t)}
                        aria-pressed={on}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                          on
                            ? 'bg-red-600 border-red-600 text-white'
                            : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                  <span className="self-center text-xs text-slate-500 ml-1">
                    {partTypes.length === 0 ? (isUk ? 'не обрано — порахуємо всі варіанти' : 'none selected — we quote all') : ''}
                  </span>
                </div>
              </div>

              {/* 4. Контакт */}
              <div className="mb-3">
                <label htmlFor="rfq-contact" className="block text-sm font-semibold text-slate-600 mb-2">
                  {isUk ? 'Куди надіслати ціну? *' : 'Where should we send the price? *'}
                </label>
                <input
                  id="rfq-contact"
                  ref={contactRef}
                  type="text"
                  autoComplete="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-xl focus:border-red-500 outline-none text-base"
                  placeholder={isUk ? 'Телефон / @telegram / email' : 'Phone / @telegram / email'}
                />
              </div>

              <div className="mb-6 text-xs text-slate-500">
                {!showCountry ? (
                  <span>
                    {isUk ? 'Доставка: ' : 'Delivery to: '}
                    <strong className="text-slate-600">{country}</strong>{' '}
                    <button
                      type="button"
                      onClick={() => setShowCountry(true)}
                      className="underline underline-offset-4 hover:text-slate-900"
                    >
                      {isUk ? 'змінити' : 'change'}
                    </button>
                  </span>
                ) : (
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-xl focus:border-red-500 outline-none text-base sm:text-sm"
                    placeholder={isUk ? 'Країна доставки' : 'Destination country'}
                  />
                )}
              </div>

              {/* Антиспам: поле не видно людям */}
              <input
                type="text"
                name="nlg_extra_field"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] w-px h-px opacity-0"
              />

              {formError && (
                <div className="mb-4 flex items-start gap-2 text-sm text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-3 text-base sm:text-lg uppercase tracking-wide disabled:opacity-70 shadow-[0_10px_30px_rgba(220,38,38,0.35)] active:scale-[0.99]"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{isUk ? 'Надсилаємо…' : 'Sending…'}</span>
                  </>
                ) : (
                  <>
                    <span>{isUk ? 'Отримати ціну' : 'Get a Quote'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-500 mt-3">
                {isUk
                  ? 'Зручніше в месенджері? Пишіть у WhatsApp, Telegram чи Viber: +44 7426 826595'
                  : 'Prefer a messenger? WhatsApp, Telegram or Viber: +44 7426 826595'}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
