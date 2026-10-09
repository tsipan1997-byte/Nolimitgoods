'use client';

import React, { useState } from 'react';
import Header from './components/header';
import HeroSection from './components/hero-section';
import RFQSection from './components/rfq-section';
import DeliveriesSection from './components/deliveries-section';
import PartsSection from './components/parts-section';
import BrandsSection from './components/brands-section';
import Footer from './components/footer';
import FloatingContact from './components/floating-contact';
import { ShieldCheck, Building2, MapPin, Copy, Check, FileCheck, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

function InlineLegalSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [copied, setCopied] = useState(false);

  const copyDetails = () => {
    const text = `NoLimitGoods Limited
UK Company No: 13146899
Director: Ivan Tsipan
Registered Address: 374 Hipsell Highway, Coventry, CV2 5FR, United Kingdom
VAT Number: GB 372 6541 87
EORI Number: GB079878335000
Phone: +44 7426 826595
Email: nolimitgoods@gmail.com`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contacts" className="py-20 bg-slate-900/60 text-white relative border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-xs sm:text-sm font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isUk ? 'Офіційні юридичні реквізити Великобританії' : 'Official UK Corporate Details'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            {isUk ? 'Юридична інформація та реквізити' : 'Legal & Corporate Credentials'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            {isUk
              ? 'Прямі експортні контракти з Великобританії. 0% UK VAT, офіційний EORI та інвойси.'
              : 'Direct supply under UK trade law with official zero-rated VAT export status.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
            <Building2 className="w-6 h-6 text-red-500 mb-4" />
            <h3 className="font-bold text-white text-base mb-2">NoLimitGoods Limited</h3>
            <p className="text-xs text-slate-400 leading-relaxed space-y-1">
              <span className="block">UK Company No: <strong className="text-white">13146899</strong></span>
              <span className="block">Director: <strong className="text-white">Ivan Tsipan</strong></span>
              <span className="block">Status: <strong className="text-emerald-400">Active / Good Standing</strong></span>
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
            <FileCheck className="w-6 h-6 text-amber-400 mb-4" />
            <h3 className="font-bold text-white text-base mb-2">{isUk ? 'Митниця та податки' : 'Tax & Customs'}</h3>
            <p className="text-xs text-slate-400 leading-relaxed space-y-1 font-mono">
              <span className="block">VAT: <strong className="text-white">GB 372 6541 87</strong></span>
              <span className="block">EORI: <strong className="text-white">GB079878335000</strong></span>
              <span className="block text-emerald-400">Export VAT: 0% Zero-Rated</span>
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
            <MapPin className="w-6 h-6 text-sky-400 mb-4" />
            <h3 className="font-bold text-white text-base mb-2">{isUk ? 'Склад і зв’язок' : 'UK Hub & Contacts'}</h3>
            <p className="text-xs text-slate-400 leading-relaxed space-y-1">
              <span className="block">374 Hipsell Highway, Coventry, CV2 5FR</span>
              <span className="block flex items-center gap-1.5 text-slate-300 pt-1">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <a href="tel:+447426826595" className="hover:text-white transition-colors">+44 7426 826595</a>
              </span>
              <span className="block flex items-center gap-1.5 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <a href="mailto:nolimitgoods@gmail.com" className="hover:text-white transition-colors">nolimitgoods@gmail.com</a>
              </span>
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={copyDetails}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-750 text-slate-200 text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">{isUk ? 'Реквізити скопійовано в буфер!' : 'Copied to clipboard!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>{isUk ? 'Скопіювати повні реквізити для договору / оплати' : 'Copy Full Credentials for Invoice'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      <Header />
      <HeroSection />
      <RFQSection />
      <DeliveriesSection />
      <PartsSection />
      <BrandsSection />
      <InlineLegalSection />
      <Footer />
      <FloatingContact />
    </main>
  );
}
