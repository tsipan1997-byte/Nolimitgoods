'use client';

import React from 'react';
import { MessageCircle, Phone, Send } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useTenant } from '@/lib/tenant-context';

// Панель месенджерів, приклеєна до низу екрана на телефоні. На комп'ютері не показується.
// WhatsApp і Viber — український номер, Telegram і дзвінок — англійський.
export default function MobileContactBar() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const CONTACT = useTenant().contact; // контакти партнера (White Label)

  const waText = encodeURIComponent(
    isUk ? 'Вітаю! Потрібна запчастина. ' : 'Hello! I need a part. '
  );

  const btn = 'flex flex-col items-center justify-center gap-0.5 h-14 text-[11px] font-bold text-white active:opacity-80';

  return (
    <nav
      className="md:hidden fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-800 bg-slate-900 print:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label={isUk ? 'Написати нам' : 'Contact us'}
    >
      <a href={`${CONTACT.whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer" className={`${btn} bg-emerald-600`}>
        <MessageCircle className="w-5 h-5" />
        WhatsApp
      </a>
      <a href={CONTACT.viber} className={`${btn} bg-[#7360F2]`}>
        <MessageCircle className="w-5 h-5" />
        Viber
      </a>
      <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#229ED9]`}>
        <Send className="w-5 h-5" />
        Telegram
      </a>
      <a href={`tel:${CONTACT.phoneUk.replace(/\s/g, '')}`} className={`${btn} bg-slate-800`}>
        <Phone className="w-5 h-5" />
        {isUk ? 'Дзвінок' : 'Call'}
      </a>
    </nav>
  );
}
