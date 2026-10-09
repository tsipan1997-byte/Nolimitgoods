'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, Translations } from './translations';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const defaultContext: LanguageContextType = {
  language: 'uk',
  setLanguage: () => {},
  t: translations.uk,
};

export const LanguageContext = createContext<LanguageContextType>(defaultContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('uk');

  useEffect(() => {
    const saved = localStorage.getItem('site_language') as Language;
    if (saved === 'en' || saved === 'uk') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('site_language', lang);
    }
  };

  const t = translations[language] || translations.uk;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  return ctx || defaultContext;
}

export default useLanguage;
