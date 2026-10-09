'use client';

import React from 'react';
import { MessageCircle, Send, PhoneCall } from 'lucide-react';

export default function WhatsAppButton() {
  const phone = '447426826595';

  return (
    <aside
      aria-label="Прямий зв'язок у месенджерах"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none"
    >
      {/* 1. Кнопка Telegram */}
      <a
        href={`https://t.me/+${phone}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написати в Telegram"
        className="pointer-events-auto group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#229ED9] text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <Send className="w-5 h-5 -translate-x-0.5 translate-y-0.5" />
        <span className="absolute right-14 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Telegram
        </span>
      </a>

      {/* 2. Кнопка Viber */}
      <a
        href={`https://viber.click/${phone}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написати у Viber"
        className="pointer-events-auto group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#7360F2] text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <PhoneCall className="w-5 h-5" />
        <span className="absolute right-14 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Viber (+44 7426 826595)
        </span>
      </a>

      {/* 3. Кнопка WhatsApp */}
      <a
        href={`https://wa.me/${phone}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написати у WhatsApp"
        className="pointer-events-auto group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute right-16 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          WhatsApp (+44 7426 826595)
        </span>
      </a>
    </aside>
  );
}
