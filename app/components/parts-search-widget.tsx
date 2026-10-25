'use client';

import { useState } from 'react';
import { Search, CheckCircle2, Clock, AlertCircle, ShoppingBag, Plus, Trash2 } from 'lucide-react';

interface PartRow {
  oem: string;
}

export default function PartsSearchWidget() {
  const [parts, setParts] = useState<PartRow[]>([{ oem: '' }]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Обробка зміни значення в рядку
  const handlePartChange = (index: number, value: string) => {
    const updated = [...parts];
    updated[index].oem = value;
    setParts(updated);

    // Якщо починають писати в останнє поле — автоматично створюємо наступне порожнє
    if (index === updated.length - 1 && value.trim().length > 0) {
      setParts([...updated, { oem: '' }]);
    }
  };

  // Видалення рядка
  const removeRow = (index: number) => {
    if (parts.length === 1) {
      setParts([{ oem: '' }]);
      return;
    }
    setParts(parts.filter((_, i) => i !== index));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeOems = parts.map(p => p.oem.trim()).filter(Boolean);

    if (activeOems.length === 0 && !comment.trim()) {
      setError('Введіть хоча б один артикул або напишіть повідомлення зі списком.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // Якщо введено лише 1 артикул без коментаря — робимо прямий швидкий пошук через API бази
    if (activeOems.length === 1 && !comment.trim()) {
      try {
        const res = await fetch(`/api/parts/search?oem=${encodeURIComponent(activeOems[0])}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Помилка пошуку');

        if (!data.found) {
          setError(data.message || 'Позицію не знайдено на складах UK. Напишіть деталі в коментар нижче для індивідуального прорахунку.');
        } else {
          setResult(data);
        }
      } catch (err: any) {
        setError(err.message || 'Помилка зв’язку із сервером');
      } finally {
        setLoading(false);
      }
    } else {
      // Якщо введено декілька номерів або є коментар — передаємо їх одразу у форму RFQ
      setLoading(false);
      const rfqElement = document.getElementById('rfq');
      if (rfqElement) {
        rfqElement.scrollIntoView({ behavior: 'smooth' });
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('fill-rfq', {
            detail: {
              partNumber: activeOems.join(', '),
              partName: 'Запит на перелік запчастин (Multiple items)',
              comment: comment,
            },
          })
        );
      }
    }
  };

  const handleOrder = () => {
    const rfqElement = document.getElementById('rfq');
    if (rfqElement) {
      rfqElement.scrollIntoView({ behavior: 'smooth' });
    }
    if (typeof window !== 'undefined' && result) {
      window.dispatchEvent(
        new CustomEvent('fill-rfq', {
          detail: {
            partNumber: result.oem,
            partName: result.title,
            estimatedPrice: `£${result.finalPriceGbp}`,
            comment: comment,
          },
        })
      );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md">
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Миттєва перевірка наявності та розрахунок з UK
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Введіть один або кілька ОЕМ-номерів (нове поле відкриється автоматично) або додайте список деталей текстом
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col gap-3 mb-6">
        {/* Список полів для номерів деталей */}
        <div className="space-y-2">
          {parts.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 w-6 text-center">
                #{idx + 1}
              </span>
              <input
                type="text"
                value={item.oem}
                onChange={(e) => handlePartChange(idx, e.target.value)}
                placeholder={idx === 0 ? "Наприклад: 281-1196, P553004, 320/04133..." : "Наступний артикул..."}
                className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 font-mono text-sm focus:outline
