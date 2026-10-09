'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { Globe } from 'lucide-react';
import { Language } from '@/lib/translations';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: { code: Language; label: string; flag: string; badge: string }[] = [
    { code: 'uk', label: 'Українська', flag: '🇺🇦', badge: 'UA' },
    { code: 'en', label: 'English', flag: '🇬🇧', badge: 'EN' },
  ];

  const current = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 border border-gray-200 cursor-pointer"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-semibold">
          {current.flag} {current.badge}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setLanguage(item.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                language === item.code
                  ? 'bg-red-50 text-red-600 font-bold'
                  : 'text-gray-700 hover:bg-gray-50 font-medium'
              }`}
            >
              <span className="text-lg">{item.flag}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
