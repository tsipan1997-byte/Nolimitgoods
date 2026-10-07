'use client';

import Image from 'next/image';
import { useLanguage } from '@/lib/language-context';

export default function Footer() {
  const { language, t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#1E3A8A] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-white/95 rounded-xl px-4 py-2 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="No Limit Goods Ltd"
                  width={140}
                  height={45}
                  className="h-10 w-auto"
                />
              </div>
            </div>
            <p className="text-white/70 max-w-md leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{language === 'uk' ? 'Швидкі посилання' : 'Quick Links'}</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('rfq')}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {t.nav.rfq}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('parts')}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {t.nav.parts}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('brands')}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {t.nav.brands}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t.nav.contact}</h4>
            <ul className="space-y-3 text-white/70">
              <li>+44 7426 826595</li>
              <li className="flex gap-3">
                <a href="https://wa.me/447426826595" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a href="https://t.me/+447426826595" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a href="viber://chat?number=447426826595" className="hover:text-purple-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.182.635 6.65.5 9.693c-.132 3.041-.3 8.75 5.36 10.398v2.378s-.037.963.598 1.16c.781.249 1.237-.502 1.984-1.304l1.512-1.715c4.166.347 7.373-.453 7.734-.564.835-.257 5.552-.875 6.32-7.14.793-6.468-.379-10.563-2.461-12.423-.634-.552-3.198-2.318-8.133-2.473-.006 0-.7-.014-1.516-.008zm.108 1.987c.704-.003 1.266.014 1.266.014 4.058.129 6.202 1.466 6.722 1.92 1.694 1.513 2.627 5.17 1.962 10.5-.626 5.107-4.358 5.462-5.047 5.672-.297.092-3.038.772-6.481.564 0 0-2.566 3.094-3.368 3.903-.127.128-.274.178-.373.156-.139-.032-.177-.186-.175-.41l.032-4.236c-4.676-1.354-4.401-6.01-4.296-8.433.108-2.428.606-4.504 2.063-5.958 1.891-1.727 5.421-1.963 7.695-1.692z"/>
                  </svg>
                </a>
              </li>
              <li><a href="mailto:sales@nolimitgoods.co.uk" className="hover:text-white transition-colors">sales@nolimitgoods.co.uk</a></li>
              <li>18 Yewdale Crescent, Coventry, CV2 2FH</li>
              <li>
                <a
                  href="https://www.facebook.com/nolimitgoodslimited"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Company Info */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/70 text-sm">
            <div>
              <h4 className="font-semibold text-white mb-2">{language === 'uk' ? 'Реєстраційні дані' : 'Company Information'}</h4>
              <p>Company Name: <span className="text-white">NOLIMITGOODS LIMITED</span></p>
              <p>Company Number: <span className="text-white">13146899</span></p>
              <p>{language === 'uk' ? 'Зареєстровано' : 'Incorporated'}: <span className="text-white">20 January 2021</span></p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">{language === 'uk' ? 'Податкові дані' : 'Tax Information'}</h4>
              <p>VAT Number: <span className="text-white">372654187</span></p>
              <p>AWRS: <span className="text-white">XQAW00000116904</span></p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">{language === 'uk' ? 'Директори' : 'Directors'}</h4>
              <p><span className="text-white">Aleksejs Kiselovs</span></p>
              <p><span className="text-white">Ivan Tsipan</span></p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/50 text-sm">{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
