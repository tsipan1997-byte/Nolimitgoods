'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Trash2, Clock, ShieldCheck } from 'lucide-react';

interface PartRow {
  oem: string;
}

export default function PartsSearchWidget() {
  const [parts, setParts] = useState<PartRow[]>([{ oem: '' }]);
  const [comment, setComment] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePartChange = (index: number, value: string) => {
    const updated = [...parts];
    updated[index].oem = value;
    setParts(updated);

    if (index === updated.length - 1 && value.trim().length > 0) {
      setParts([...updated, { oem: '' }]);
    }
  };

  const removeRow = (index: number) => {
    if (parts.length === 1) {
      setParts([{ oem: '' }]);
      return;
    }
    setParts(parts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeOems = parts.map((p) => p.oem.trim()).filter(Boolean);

    if (activeOems.length === 0 && !comment.trim()) {
      setError('Вкажіть хоча б один номер деталі або скопіюйте список у повідомлення.');
      return;
    }

    if (!contact.trim()) {
      setError('Будь ласка, вкажіть ваш номер телефону, Telegram або Email для зв’язку.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/parts/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parts: activeOems,
          comment: comment.trim(),
          contact: contact.trim(),
        }),
      });

      if (!res.ok) {
        const rfqElement = document.getElementById('rfq');
        if (rfqElement) {
          rfqElement.scrollIntoView({ behavior: 'smooth' });
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('fill-rfq', {
              detail: {
                partNumber: activeOems.join(', '),
                comment: `${comment}\nКонтакт: ${contact}`,
              },
            })
          );
        }
      }

      setSubmitted(true);
      setParts([{ oem: '' }]);
      setComment('');
      setContact('');
    } catch (err: any) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-md text-white">
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight">
          Запит наявності та точної ціни деталей
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Введіть каталожні номери або скопіюйте повний список у поле нижче.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 bg-slate-950 border border-emerald-500/40 rounded-2xl text-center space-y-3 animate-fadeIn">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">Запит прийнято</h3>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Наш фахівець перевірить наявність та зв'яжеться з вами для уточнення вартості.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Надіслати ще один запит
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Каталожні номери (OEM / Part Numbers):
            </label>
            {parts.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500 w-6 text-center">
                  #{idx + 1}
                </span>
                <input
                  type="text"
                  value={item.oem}
                  onChange={(e) => handlePartChange(idx, e.target.value)}
                  placeholder={idx === 0 ? 'Наприклад: 281-1196, 281-1199, P553004...' : 'Наступний артикул...'}
                  className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-red-500 transition-colors uppercase"
                />
                {parts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    className="p-3 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition cursor-pointer"
                    title="Видалити позицію"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Повідомлення або перелік запчастин списком:
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Сюди можна скопіювати весь список деталей, вказати марку, модель техніки або коментарі..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-red-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Ваш телефон, Telegram або Email (обов'язково):
            </label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="+380... або @username / your@email.com"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-red-400 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Прямий B2B-контракт • 0% UK Export VAT</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span>Експрес 5–14 роб. днів (до 1 міс. на габарит)</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 cursor-pointer text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-red-950/50 mt-1"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Надсилаємо запит...' : 'Надіслати запит на прорахунок →'}
          </button>
        </form>
      )}
    </div>
  );
}
