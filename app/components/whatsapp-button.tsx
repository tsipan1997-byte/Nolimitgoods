'use client';

import React, { useState } from 'react';
import { MessageSquare, Phone, X, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function WhatsAppButton() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [open, setOpen] = useState(false);

  const phone = '+447426826595';
  const defaultMsg = isUk
    ? 'Доброго дня! Цікавить наявність та ціна запчастин зі складу в Ковентрі.'
    : 'Hello! I need a quote and availability for heavy equipment parts from your UK stock.';

  const waUrl = `https://wa.me/447426826595?text=${encodeURIComponent(defaultMsg)}`;
  const tgUrl = 'https://t.me/+447426826595';
  const viberUrl = 'viber://chat?number=%2B447426826595';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Спливаюче меню месенджерів */}
      {open && (
        <div className="mb-3 w-72 rounded-2xl bg-slate-900/95 border border-slate-700/80 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200 text-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-slate-200">
                {isUk ? 'Менеджер у Ковентрі' : 'UK Dispatch Desk'}
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
            {isUk
              ? 'Надішліть фото маркування, шильдика або каталожний номер для розрахунку:'
              : 'Send part photo, serial number or VIN for instant landed quote:'}
          </p>

          <div className="space-y-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp (+44 7426 826595)</span>
            </a>

            <a
              href={tgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 w-full py-2.5 px-3 rounded-xl bg-[#229ED9] hover:bg-[#1d8fc3] text-white font-bold text-xs transition-colors shadow-md"
            >
              <span className="text-sm">🔵</span>
              <span>Telegram</span>
            </a>

            <a
              href={viberUrl}
              className="flex items-center gap-2.5 w-full py-2.5 px-3 rounded-xl bg-[#7360f2] hover:bg-[#624ee4] text-white font-bold text-xs transition-colors shadow-md"
            >
              <span className="text-sm">🟣</span>
              <span>Viber</span>
            </a>

            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2.5 w-full py-2.5 px-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>{isUk ? 'Зателефонувати в UK хаб' : 'Direct UK Call'}</span>
            </a>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>NoLimitGoods Ltd</span>
            <span>VAT 372654187</span>
          </div>
        </div>
      )}

      {/* Головна кнопка віджета */}
      <button
        onClick={() => setOpen(!open)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 to-red-500 text-white shadow-2xl shadow-red-600/40 border-2 border-red-400/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        aria-label="Contact support"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-slate-950" />
        </span>

        {open ? (
          <X className="w-6 h-6 transition-transform rotate-90 duration-200" />
        ) : (
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        )}
      </button>
    </div>
  );
}
