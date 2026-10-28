'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

const STORAGE_KEY = 'nlg_cookie_consent';

function applyConsent(granted: boolean) {
  const w = window as any;
  if (typeof w.fbq === 'function') {
    w.fbq('consent', granted ? 'grant' : 'revoke');
    if (granted) w.fbq('track', 'PageView');
  }
  if (typeof w.gtag === 'function') {
    const value = granted ? 'granted' : 'denied';
    w.gtag('consent', 'update', {
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
      analytics_storage: value,
    });
  }
}

export default function CookieConsent() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }

    // Дозволяє відкрити налаштування повторно з футера
    const reopen = () => setVisible(true);
    window.addEventListener('nlg:open-cookie-settings', reopen);
    return () => window.removeEventListener('nlg:open-cookie-settings', reopen);
  }, []);

  const choose = (granted: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, granted ? 'granted' : 'denied');
    } catch {
      // ігноруємо, якщо сховище недоступне
    }
    applyConsent(granted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={isUk ? 'Налаштування cookie' : 'Cookie settings'}
      className="fixed bottom-0 left-0 right-0 z-[60] p-3 sm:p-4 print:hidden"
    >
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed flex-1">
          {isUk
            ? 'Ми використовуємо cookie та піксель Meta і Google, щоб розуміти, як працює наш сайт і показувати релевантну рекламу. Ви можете погодитися або відмовитися. '
            : 'We use cookies and Meta and Google pixels to understand how our site performs and to show relevant ads. You can accept or decline. '}
          <Link href="/privacy" className="underline underline-offset-4 text-white hover:text-slate-200">
            {isUk ? 'Політика конфіденційності' : 'Privacy Policy'}
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => choose(false)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
          >
            {isUk ? 'Відхилити' : 'Decline'}
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
          >
            {isUk ? 'Прийняти' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
}
