'use client';

import { useState } from 'react';
import { Search, CheckCircle2, Clock, AlertCircle, ShoppingBag } from 'lucide-react';

export default function PartsSearchWidget() {
  const [oem, setOem] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oem.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/parts/search?oem=${encodeURIComponent(oem)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Помилка пошуку');

      if (!data.found) {
        setError(data.message || 'Позицію не знайдено на складах UK. Спробуйте інший номер або залиште запит менеджеру.');
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Помилка зв’язку із сервером');
    } finally {
      setLoading(false);
    }
  };

  // Перенаправлення до блоку RFQ із заповненими даними
  const handleOrder = () => {
    const rfqElement = document.getElementById('rfq');
    if (rfqElement) {
      rfqElement.scrollIntoView({ behavior: 'smooth' });
    }
    // Передаємо параметри у форму запиту (через подію або session storage)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('fill-rfq', {
          detail: {
            partNumber: result.oem,
            partName: result.title,
            estimatedPrice: `£${result.finalPriceGbp}`,
          },
        })
      );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md">
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Миттєва перевірка наявності в UK
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Введіть ОЕМ або каталожний номер для розрахунку вартості з доставкою з Ковентрі
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={oem}
          onChange={(e) => setOem(e.target.value)}
          placeholder="Наприклад: P553004, 320/04133, 1R-0716..."
          className="flex-1 px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-red-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Перевірка складів...' : 'Знайти ціну'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                Знайдено в системі • {result.bestSupplier || 'UK Hub'}
              </span>
              <h3 className="font-bold text-lg text-white mt-0.5">{result.title}</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">OEM: {result.oem}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block">Ціна з доставкою (UK):</span>
              <span className="text-3xl font-black text-white">
                £{result.finalPriceGbp}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Склад відвантаження: <strong className="text-white">{result.hub}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Термін транзиту в Україну: <strong>5–8 днів</strong></span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleOrder}
              type="button"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Оформити заявку на цю запчастину
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
