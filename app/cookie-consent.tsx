'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';

export default function CookieConsent() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('nlg_cookie_consent');
    if (!consent) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('nlg_cookie_consent', 'granted');
    if (typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          analytics_storage: 'granted',
        });
      }
      if ((window as any).fbq) {
        (window as any).fbq('consent', 'grant');
      }
    }
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-slate-900/95 border border-slate-800 text-slate-200 p-4 rounded-2xl shadow-2xl backdrop-blur-md z-50 flex flex-col gap-3">
      <p className="text-xs leading-relaxed text-slate-300">
        {isUk
          ? 'Ми використовуємо файли cookie для оптимізації роботи сайту, аналітики та точного розрахунку специфікацій.'
          : 'We use cookies to enhance website performance, analytics, and precise order calculations.'}
      </p>
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
        >
          {isUk ? 'Зрозуміло' : 'Accept'}
        </button>
      </div>
    </div>
  );
}
