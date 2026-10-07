'use client';

import { useLanguage } from '@/lib/language-context';

export default function SEOSection() {
  const { t } = useLanguage();

  return (
    <section className="py-8 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-600 text-sm">
          {t.seo.text}
        </p>
      </div>
    </section>
  );
}
