'use client';

import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingContact() {
  const whatsappNumber = '447426826595';
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello! I need a quote for heavy equipment spare parts.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="text-sm hidden sm:inline">WhatsApp Parts Quote</span>
      </a>

      <a
        href={`tel:+${whatsappNumber}`}
        aria-label="Call Us"
        className="flex items-center justify-center w-12 h-12 bg-slate-900 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700 hover:border-red-600"
      >
        <Phone className="w-5 h-5" />
      </a>
    </div>
  );
}
