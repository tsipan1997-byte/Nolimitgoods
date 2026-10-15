'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, X, Send } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const phoneRaw = '+447426826595';
  const phoneDisplay = '+44 7426 826595';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 print:hidden">
      {/* Меню з кнопками месенджерів при кліку */}
      {isOpen && (
        <div className="flex flex-col gap-2.5 bg-slate-900 border border-slate-700/80 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200 min-w-[210px]">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
            {isUk ? 'Звʼязок з хабом UK:' : 'Direct Hub Contact:'}
          </span>

          {/* 1. WHATSAPP */}
          <a
            href={`https://wa.me/${phoneRaw.replace('+', '')}?text=${encodeURIComponent(
              isUk ? 'Вітаю! Потрібна консультація щодо запчастин.' : 'Hello! I need assistance with spare parts.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp UK</span>
          </a>

          {/* 2. TELEGRAM */}
          <a
            href="https://t.me/+447426826595"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#229ED9] hover:bg-[#1d8dbf] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Telegram</span>
          </a>

          {/* 3. VIBER */}
          <a
            href="viber://chat?number=%2B447426826595"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#7360F2] hover:bg-[#6350e0] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Viber</span>
          </a>

          {/* 4. ПРЯМИЙ ДЗВІНОК */}
          <a
            href={`tel:${phoneRaw}`}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
          >
            <Phone className="w-4 h-4 text-slate-400" />
            <span>{phoneDisplay}</span>
          </a>
        </div>
      )}

      {/* Головна кругла кнопка */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 cursor-pointer group"
        aria-label="Contact options"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-slate-300" />
        ) : (
          <div className="relative flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
