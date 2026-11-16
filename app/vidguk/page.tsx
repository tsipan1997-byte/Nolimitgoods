'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, CheckCircle2, Loader2 } from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';

export default function ReviewPage() {
  const [rating, setRating] = useState(5);
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState('sending');
    try {
      const r = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'),
          city: f.get('city'),
          part: f.get('part'),
          text: f.get('text'),
          contact: f.get('contact'),
          publish: f.get('publish') === 'on',
          website_hp: f.get('website_hp'),
          rating,
        }),
      });
      setState(r.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  };

  const input = 'w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-red-500';

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-10">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Як пройшло ваше замовлення?</h1>
        <p className="mt-3 text-slate-600">Кілька слів допоможуть іншим покупцям. Опублікуємо на сайті лише з вашої згоди.</p>

        {state === 'done' ? (
          <div className="mt-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            <div className="mt-2 text-xl font-black">Дякуємо за відгук!</div>
            <Link href="/" className="mt-4 inline-block text-sm font-bold text-red-600">На головну →</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <div className="text-sm font-bold mb-2">Оцінка</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button key={i} type="button" onClick={() => setRating(i)} aria-label={`${i}`}>
                    <Star className={`w-9 h-9 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <input name="name" required placeholder="Ваше ім'я *" className={input} />
              <input name="city" placeholder="Місто" className={input} />
            </div>
            <input name="part" placeholder="Що замовляли (деталь, техніка)" className={input} />
            <textarea name="text" required minLength={5} rows={5} placeholder="Ваш відгук *" className={input} />
            <input name="contact" placeholder="Телефон або Telegram (не публікується)" className={input} />
            <input name="website_hp" tabIndex={-1} autoComplete="off" className="hidden" />
            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input type="checkbox" name="publish" defaultChecked className="mt-1 w-4 h-4 accent-red-600" />
              Дозволяю опублікувати відгук на сайті (ім'я, місто і текст)
            </label>
            <button
              type="submit"
              disabled={state === 'sending'}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase disabled:opacity-60"
            >
              {state === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}
              Надіслати відгук
            </button>
            {state === 'error' && <p className="text-sm text-red-600">Не вдалося надіслати. Спробуйте ще раз або напишіть нам у Telegram.</p>}
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
