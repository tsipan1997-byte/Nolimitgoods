'use client';

import { useLanguage } from '@/lib/language-context';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

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

  const languages = [
    { code: 'uk' as const, displayCode: 'UA', label: 'Українська', flag: '🇺🇦' },
    { code: 'en' as const, displayCode: 'EN', label: 'English', flag: '🇬🇧' },
  ];

  // Співставляємо з урахуванням 'uk', 'ua' та ставимо українську за замовчуванням
  const currentLang =
    languages.find(
      (l) => l.code === language || (language === 'ua' && l.code === 'uk')
    ) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 border border-gray-200 cursor-pointer"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-semibold">
          {currentLang.flag} {currentLang.displayCode}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
          {languages.map((lang) => {
            const isSelected =
              language === lang.code || (language === 'ua' && lang.code === 'uk');

            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code as any);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-red-50 text-red-600 font-bold'
                    : 'text-gray-700 hover:bg-gray-50 font-medium'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm">{lang.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
