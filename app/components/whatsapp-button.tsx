'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, PhoneCall } from 'lucide-react';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const phone = '447426826595';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Меню швидкого вибору */}
      {isOpen && (
        <div className="mb-3 flex flex-col gap-2.5 bg-white p-3.5 rounded-2xl shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-bottom-3 duration-200 min-w-[250px]">
          <div className="px-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Швидкий зв'язок (UK Склад)
          </div>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs transition-colors"
          >
            <span className="text-lg">🟢</span>
            <div>
              <div className="font-bold">WhatsApp</div>
              <div className="text-[10px] text-emerald-600 font-normal">+44 7426 826595</div>
            </div>
          </a>

          {/* Telegram */}
          <a
            href={`https://t.me/+${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sky-50 text-sky-800 hover:bg-sky-100 font-semibold text-xs transition-colors"
          >
            <Send className="w-4 h-4 text-sky-600 ml-0.5" />
            <div>
              <div className="font-bold">Telegram</div>
              <div className="text-[10px] text-sky-600 font-normal">Прямий діалог</div>
            </div>
          </a>

          {/* Viber (прямий виклик додатку без редиректів) */}
          <a
            href={`viber://chat?number=%2B${phone}`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 font-semibold text-xs transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-purple-600 ml-0.5" />
            <div>
              <div className="font-bold">Viber</div>
              <div className="text-[10px] text-purple-600 font-normal">+44 7426 826595</div>
            </div>
          </a>
        </div>
      )}

      {/* Головна кругла кнопка */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Зв'язатися з нами"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </button>
    </div>
  );
}
