'use client';

import { useLanguage } from '@/lib/language-context';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Про компанію */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4 tracking-tight">
              NoLimitGoods Limited
            </h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Прямі поставки оригінальних запчастин та аналогів для спецтехніки, агро- і вантажного транспорту з Великої Британії та Європи в Україну.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-semibold text-emerald-400 border border-slate-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Офіційна реєстрація в UK</span>
            </div>
          </div>

          {/* Юридичні реквізити */}
          <div>
            <h4 className="text-white text-base font-semibold mb-4">
              Юридична інформація
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <span className="text-slate-500">Директор:</span>{' '}
                <strong className="text-slate-200">Ivan Tsipan</strong>
              </li>
              <li>
                <span className="text-slate-500">Company No:</span>{' '}
                <strong className="text-slate-200">13146899</strong> (UK)
              </li>
              <li>
                <span className="text-slate-500">VAT / TAX:</span>{' '}
                <span className="text-slate-300">372654187</span>
              </li>
              <li>
                <span className="text-slate-500">EORI:</span>{' '}
                <span className="text-slate-300">GB079878335000</span>
              </li>
            </ul>
          </div>

          {/* Контакти та адреса */}
          <div>
            <h4 className="text-white text-base font-semibold mb-4">
              Контакти у Великій Британії
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Coventry, 374 Hipsell Highway, West Midlands, UK</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <a
                  href="tel:+447426826595"
                  className="hover:text-white transition-colors"
                >
                  +44 7426 826595
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <a
                  href="mailto:sales@nolimitgoods.com"
                  className="hover:text-white transition-colors"
                >
                  sales@nolimitgoods.com
                </a>
              </li>
            </ul>
          </div>

          {/* Швидкі месенджери */}
          <div>
            <h4 className="text-white text-base font-semibold mb-4">
              Зв'язок з директором
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Швидка консультація щодо замовлень та наявності:
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://wa.me/447426826595"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors text-xs font-semibold"
              >
                <span>🟢 WhatsApp (+44 7426 826595)</span>
              </a>
              <a
                href="viber://chat?number=%2B447426826595"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors text-xs font-semibold"
              >
                <span>🟣 Viber (+44 7426 826595)</span>
              </a>
              <a
                href="https://t.me/+447426826595"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-600/20 text-sky-400 hover:bg-sky-600/30 transition-colors text-xs font-semibold"
              >
                <span>🔵 Telegram</span>
              </a>
            </div>
          </div>

        </div>

        {/* Копірайт та права */}
        <div className="pt-8 border-t border-slate-800 text-center sm:flex sm:justify-between sm:items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NoLimitGoods Limited. Всі права захищено.</p>
          <p className="mt-2 sm:mt-0">
            Registered in England & Wales • Company No. 13146899
          </p>
        </div>
      </div>
    </footer>
  );
}
