'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HardHat,
  Forklift,
  Tractor,
  Cog,
  BadgeCheck,
  Recycle,
  Layers,
  Send,
  CheckCircle2,
  Gavel,
  ArrowRight,
  Search,
  Clock,
  Truck,
} from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';
import FloatingContact from '../components/floating-contact';
import { CONTACT } from '@/lib/site-config';
import { MACHINE_BRANDS, MACHINE_GROUPS, type MachineBrand, type MachineGroupId } from '@/lib/spectehnika';
import { CONTACT_ERROR, CONTACT_LABEL, CONTACT_PLACEHOLDER, isPhoneOrTelegram } from '@/lib/contact-validation';
import { getFbc, trackLead } from '@/lib/meta-client';

const GROUP_ICON: Record<MachineGroupId, React.ComponentType<{ className?: string }>> = {
  construction: HardHat,
  handling: Forklift,
  agro: Tractor,
  drivetrain: Cog,
};

function RequestForm({ brand }: { brand?: MachineBrand }) {
  const [part, setPart] = useState('');
  const [machine, setMachine] = useState(brand ? `${brand.name} ` : '');
  const [serial, setSerial] = useState('');
  const [kind, setKind] = useState('Будь-який варіант');
  const [contact, setContact] = useState('');
  const [comment, setComment] = useState('');
  const [hp, setHp] = useState('');
  const [contactError, setContactError] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!part.trim() && !comment.trim()) return;
    if (!isPhoneOrTelegram(contact)) {
      setContactError(true);
      return;
    }
    setStatus('sending');
    const leadId = `NLG-S${Date.now().toString().slice(-6)}`;
    const fd = new FormData();
    fd.append('leadId', leadId);
    fd.append('fbc', getFbc());
    fd.append('contact', contact.trim());
    fd.append('partType', `Спецтехніка: ${kind}`);
    fd.append(
      'comment',
      [machine.trim() && `Техніка: ${machine.trim()}`, serial.trim() && `Серійний номер: ${serial.trim()}`, comment.trim()]
        .filter(Boolean)
        .join('\n')
    );
    if (part.trim()) {
      fd.append('items', JSON.stringify([{ partNumber: part.trim(), machineModel: machine.trim(), quantity: 1 }]));
    }
    fd.append('source', brand ? `Спецтехніка — ${brand.name}` : 'Спецтехніка');
    fd.append('page', brand ? `/spectehnika/${brand.slug}` : '/spectehnika');
    fd.append('website_hp', hp);
    try {
      const res = await fetch('/api/lead', { method: 'POST', body: fd });
      if (res.ok) {
        const w = window as any;
        trackLead(leadId, { content_name: brand ? `Spec ${brand.name}` : 'Spec parts' });
        if (typeof w.gtag === 'function') w.gtag('event', 'conversion', { send_to: 'AW-670192610/Sx8lCIG5m54dEOKnyb8C' });
      }
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="rounded-3xl bg-white p-6 sm:p-8 text-center shadow-xl">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <p className="mt-3 text-xl font-black text-slate-900">Запит отримали</p>
        <p className="mt-2 text-sm text-slate-600">
          Перевіримо наявність по складах і повернемось з варіантами: оригінал, аналог, б/у. Зазвичай у той самий робочий день.
        </p>
      </div>
    );
  }

  const input = 'mt-1 w-full h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-red-500 outline-none text-slate-900 placeholder-slate-400';

  return (
    <form id="spec-form" onSubmit={submit} className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl space-y-4 scroll-mt-28">
      <div>
        <p className="text-xs font-bold uppercase text-red-600">Запит на запчастину</p>
        <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900">Ціна і наявність за 1 робочий день</h2>
      </div>
      <label className="block">
        <span className="text-sm font-bold text-slate-800">Номер деталі або що потрібно *</span>
        <input value={part} onChange={(e) => setPart(e.target.value)} placeholder="Напр. 52914511 або «клапан коробки»" className={input} />
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-bold text-slate-800">Марка і модель техніки</span>
          <input value={machine} onChange={(e) => setMachine(e.target.value)} placeholder="Напр. Manitou MLT 628 T" className={input} />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-slate-800">Серійний номер (з таблички)</span>
          <input value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="Допомагає підібрати точно" className={input} />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-bold text-slate-800">Що розглядаєте</span>
        <select value={kind} onChange={(e) => setKind(e.target.value)} className={`${input} bg-white`}>
          <option>Будь-який варіант</option>
          <option>Тільки оригінал</option>
          <option>Аналог (дешевше)</option>
          <option>Б/у з розбірки</option>
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-bold text-slate-800">Коментар</span>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} placeholder="Що зламалось, кількість, терміновість" className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 outline-none text-slate-900 placeholder-slate-400" />
      </label>
      <label className="block">
        <span className="text-sm font-bold text-slate-800">{CONTACT_LABEL}</span>
        <input
          required
          type="tel"
          autoComplete="tel"
          value={contact}
          onChange={(e) => {
            setContact(e.target.value);
            if (contactError) setContactError(false);
          }}
          placeholder={CONTACT_PLACEHOLDER}
          aria-invalid={contactError}
          className={contactError ? input.replace('border-slate-200 focus:border-red-500', 'border-red-500') : input}
        />
        {contactError && <span className="mt-1 block text-xs font-semibold text-red-600">{CONTACT_ERROR}</span>}
      </label>
      <input type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" aria-hidden="true" name="website_hp" />
      <button type="submit" disabled={status === 'sending'} className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-black flex items-center justify-center gap-2">
        <Send className="w-5 h-5" /> {status === 'sending' ? 'Надсилаємо…' : 'Отримати ціну'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-red-600">
          Не вдалося надіслати. Напишіть нам у WhatsApp {CONTACT.waDisplay}.
        </p>
      )}
      <p className="text-xs text-slate-500">
        Фото таблички або старої деталі зручно скинути у{' '}
        <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="underline">WhatsApp</a> чи{' '}
        <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" className="underline">Telegram</a>.
      </p>
    </form>
  );
}

export default function SpecView({ brand }: { brand?: MachineBrand }) {
  const others = brand ? MACHINE_BRANDS.filter((b) => b.slug !== brand.slug && b.group === brand.group) : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      {/* Hero */}
      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <nav className="text-xs text-slate-400 mb-4">
              <Link href="/" className="hover:text-white">Головна</Link> /{' '}
              {brand ? (
                <>
                  <Link href="/spectehnika" className="hover:text-white">Спецтехніка</Link> / <span className="text-slate-200">{brand.name}</span>
                </>
              ) : (
                <span className="text-slate-200">Спецтехніка</span>
              )}
            </nav>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {brand ? (
                <>Запчастини {brand.name} — <span className="text-red-500">оригінал, аналог, б/у</span></>
              ) : (
                <>Запчастини для спецтехніки і <span className="text-red-500">сільгосптехніки</span></>
              )}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-xl">
              {brand
                ? brand.intro
                : 'Будівельна техніка, телескопи, трактори, комбайни, двигуни і коробки. Шукаємо по складах дилерів і розбірок Великої Британії та Європи — понад 3 мільйони позицій.'}
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-slate-200">
              <li className="flex items-center gap-3"><Search className="w-5 h-5 text-red-500 shrink-0" /> Підбір за номером деталі, моделлю або серійним номером техніки</li>
              <li className="flex items-center gap-3"><Clock className="w-5 h-5 text-red-500 shrink-0" /> Варіанти з цінами — зазвичай у той самий робочий день</li>
              <li className="flex items-center gap-3"><Truck className="w-5 h-5 text-red-500 shrink-0" /> Доставка в Україну 5–14 робочих днів, документи для митниці</li>
            </ul>
            {brand && brand.models.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-bold uppercase text-slate-400">Популярні моделі</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {brand.models.map((m) => (
                    <span key={m} className="px-3 py-1.5 rounded-lg bg-white/10 text-sm font-semibold">{brand.name.split(' ')[0]} {m}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <RequestForm brand={brand} />
        </div>
      </section>

      {/* Три варіанти */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-black">На кожну деталь — до трьох варіантів</h2>
        <p className="mt-2 text-slate-600 max-w-2xl">Ви бачите різницю в ціні й терміні та обираєте самі. Якщо номер знято з виробництва, знайдемо актуальну заміну.</p>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {[
            { icon: BadgeCheck, t: 'Оригінал', d: 'Нові оригінальні деталі через дилерські мережі Великої Британії та ЄС. Для техніки на гарантії і критичних вузлів.' },
            { icon: Layers, t: 'Якісний аналог', d: 'Перевірені виробники, що постачають на конвеєр або мають гарантію 12 місяців. Зазвичай на 20–40% дешевше за оригінал.' },
            { icon: Recycle, t: 'Б/у з розбірок', d: 'Вузли з розібраної техніки в Англії, Данії, Нідерландах, Польщі: коробки, мости, гідравліка, двигуни. Перевіряємо стан і фото до оплати.' },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl bg-white border border-slate-200 p-6">
              <c.icon className="w-8 h-8 text-red-600" />
              <h3 className="mt-3 text-lg font-black">{c.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Бренди */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-black">{brand ? `Інші бренди: ${MACHINE_GROUPS.find((g) => g.id === brand.group)?.uk}` : 'Бренди, з якими працюємо'}</h2>
          {brand ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {others.map((b) => (
                <Link key={b.slug} href={`/spectehnika/${b.slug}`} className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-red-500 hover:text-red-600 font-bold text-sm">{b.name}</Link>
              ))}
              <Link href="/spectehnika" className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center gap-1">Усі бренди <ArrowRight className="w-4 h-4" /></Link>
            </div>
          ) : (
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {MACHINE_GROUPS.map((g) => {
                const Icon = GROUP_ICON[g.id];
                return (
                  <div key={g.id} className="rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-red-600" />
                      <h3 className="text-lg font-black">{g.uk}</h3>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{g.hint}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {MACHINE_BRANDS.filter((b) => b.group === g.id).map((b) => (
                        <Link key={b.slug} href={`/spectehnika/${b.slug}`} className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 font-semibold text-sm">{b.name}</Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <p className="mt-6 text-sm text-slate-500">Немає вашого бренду? Напишіть номер деталі — шукаємо по 2800+ брендах.</p>
        </div>
      </section>

      {/* Як працюємо */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-black">Як замовити</h2>
        <ol className="mt-8 grid md:grid-cols-4 gap-5">
          {[
            ['Надішліть номер або фото', 'Номер деталі, фото таблички техніки чи старої деталі.'],
            ['Отримайте варіанти', 'Оригінал, аналог, б/у — з ціною до України і терміном.'],
            ['Оплата', 'Рахунок від британської компанії NoLimitGoods Ltd.'],
            ['Доставка', 'Збираємо на складі в Ковентрі й відправляємо в Україну.'],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-2xl bg-white border border-slate-200 p-6">
              <span className="w-9 h-9 rounded-full bg-red-600 text-white font-black flex items-center justify-center">{i + 1}</span>
              <h3 className="mt-3 font-black">{t}</h3>
              <p className="mt-1 text-sm text-slate-600">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Аукціони */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Link href="/aukciony" className="block rounded-3xl bg-slate-900 text-white p-6 sm:p-10 hover:bg-slate-800 transition-colors">
          <div className="flex items-center gap-3 text-red-500 font-bold text-sm uppercase"><Gavel className="w-5 h-5" /> Потрібна сама техніка?</div>
          <p className="mt-2 text-2xl sm:text-3xl font-black">Купимо спецтехніку на аукціонах Англії під ваше замовлення</p>
          <p className="mt-2 text-slate-300">Екскаватори, JCB 3CX, телескопи, трактори — з поточними ставками, оновлюються двічі на день.</p>
          <span className="mt-5 inline-flex items-center gap-2 font-bold">Дивитись лоти <ArrowRight className="w-4 h-4" /></span>
        </Link>
      </section>

      <Footer />
      <FloatingContact />
    </div>
  );
}
