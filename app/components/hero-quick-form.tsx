'use client';

import React, { useRef, useState } from 'react';
import { Camera, Loader2, CheckCircle2, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { CONTACT } from '@/lib/site-config';

// Швидка заявка на першому екрані: VIN / номер деталі, фото, телефон.
// Шле в той самий /api/lead, що й велика форма, тож заявка падає в Telegram і таблицю.

const MAX_PHOTOS = 3;

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
    const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82));
    if (!blob) return file;
    return new File([blob], (file.name || 'photo').replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

function getSource(): string {
  if (typeof window === 'undefined') return '';
  try {
    const params = new URLSearchParams(window.location.search);
    const parts: string[] = ['hero-form'];
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
      const v = params.get(k);
      if (v) parts.push(`${k}=${v}`);
    });
    if (params.get('fbclid')) parts.push('fbclid=yes');
    if (params.get('gclid')) parts.push('gclid=yes');
    if (document.referrer) {
      try {
        const host = new URL(document.referrer).hostname;
        if (host && host !== window.location.hostname) parts.push(`ref=${host}`);
      } catch {}
    }
    return parts.join(' ');
  } catch {
    return 'hero-form';
  }
}

export default function HeroQuickForm() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const [query, setQuery] = useState('');
  const [phone, setPhone] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [leadId, setLeadId] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const onFiles = async (list: FileList | null) => {
    if (!list) return;
    const picked = Array.from(list).slice(0, MAX_PHOTOS - photos.length);
    const compressed = await Promise.all(picked.map(compressImage));
    setPhotos((prev) => [...prev, ...compressed].slice(0, MAX_PHOTOS));
    if (fileRef.current) fileRef.current.value = '';
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!query.trim() && photos.length === 0) {
      setError(isUk ? 'Напишіть VIN, номер деталі або додайте фото.' : 'Enter a VIN, part number or add a photo.');
      return;
    }
    if (phone.replace(/[^0-9]/g, '').length < 9 && !/@/.test(phone)) {
      setError(isUk ? 'Вкажіть телефон, щоб ми надіслали ціну.' : 'Add your phone so we can send the price.');
      phoneRef.current?.focus();
      return;
    }

    const id = `NLG-${Date.now().toString().slice(-6)}`;
    setLeadId(id);
    setStatus('sending');

    const fd = new FormData();
    fd.append('leadId', id);
    fd.append('contact', phone.trim());
    fd.append('comment', query.trim());
    fd.append('country', isUk ? 'Україна' : 'Ukraine');
    fd.append('partType', isUk ? 'Всі варіанти' : 'Any');
    fd.append('source', getSource());
    fd.append('page', window.location.pathname);
    fd.append('website_hp', honeypot);
    fd.append('items', '[]');
    photos.forEach((p) => fd.append('photos', p, p.name));

    try {
      const res = await fetch('/api/lead', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(String(res.status));
      const w = window as any;
      if (typeof w.gtag === 'function') w.gtag('event', 'conversion', { send_to: 'AW-670192610/Sx8lCIG5m54dEOKnyb8C' });
      if (typeof w.fbq === 'function') w.fbq('track', 'Lead', { content_name: 'Hero form' });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="mt-8 max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-black text-slate-900">{isUk ? `Заявку ${leadId} прийнято` : `Request ${leadId} received`}</div>
            <p className="mt-1 text-sm text-slate-600">
              {isUk
                ? `Підберемо оригінал, аналог і б/у та надішлемо ціни на ${phone}. Терміново? Пишіть у WhatsApp/Viber ${CONTACT.waDisplay}.`
                : `We'll quote genuine, aftermarket and used options to ${phone}. Urgent? WhatsApp/Viber ${CONTACT.waDisplay}.`}
            </p>
            <button
              type="button"
              onClick={() => { setStatus('idle'); setQuery(''); setPhotos([]); }}
              className="mt-3 text-sm font-bold text-red-600 hover:underline"
            >
              {isUk ? 'Ще одна деталь' : 'Another part'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 max-w-xl rounded-2xl bg-white border border-slate-200 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)] p-4 sm:p-5"
    >
      <div className="text-sm font-black text-slate-900">
        {isUk ? 'Знайти запчастину — надішлемо ціну' : 'Find a part — we send you the price'}
      </div>

      {/* honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isUk ? 'VIN, номер деталі або що шукаєте' : 'VIN, part number or what you need'}
          className="flex-1 min-w-0 h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          aria-label={isUk ? 'VIN або номер деталі' : 'VIN or part number'}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={photos.length >= MAX_PHOTOS}
          className="h-12 px-3.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 text-sm font-bold shrink-0 disabled:opacity-50"
          aria-label={isUk ? 'Додати фото' : 'Add photo'}
        >
          <Camera className="w-5 h-5 text-red-600" />
          <span className="hidden sm:inline">{isUk ? 'Фото' : 'Photo'}</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      {photos.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {photos.map((p, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg bg-slate-100 text-xs text-slate-700">
              📷 {isUk ? `Фото ${i + 1}` : `Photo ${i + 1}`}
              <button
                type="button"
                onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                className="p-0.5 rounded hover:bg-slate-200"
                aria-label={isUk ? 'Прибрати фото' : 'Remove photo'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="mt-2 flex flex-col sm:flex-row gap-2">
        <input
          ref={phoneRef}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={isUk ? 'Ваш телефон (Viber / WhatsApp)' : 'Your phone (WhatsApp / Viber)'}
          className="flex-1 min-w-0 h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          aria-label={isUk ? 'Телефон' : 'Phone'}
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(220,38,38,0.30)] active:scale-[0.98] disabled:opacity-70 shrink-0"
        >
          {status === 'sending' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              {isUk ? 'Дізнатись ціну' : 'Get price'} <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {(error || status === 'error') && (
        <p className="mt-2 text-sm text-red-600">
          {error ||
            (isUk
              ? `Не вдалося надіслати. Напишіть нам у WhatsApp/Viber ${CONTACT.waDisplay}.`
              : `Could not send. Message us on WhatsApp/Viber ${CONTACT.waDisplay}.`)}
        </p>
      )}

      <p className="mt-2 text-xs text-slate-500">
        {isUk ? 'Без реєстрації. Порахуємо оригінал, аналог і б/у.' : 'No sign-up. We quote genuine, aftermarket and used.'}
      </p>
    </form>
  );
}
