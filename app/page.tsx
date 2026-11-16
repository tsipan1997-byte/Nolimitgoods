'use client';

import React from 'react';
import Header from './components/header';
import HeroSection from './components/hero-section';
import RFQSection from './components/rfq-section';
import BrandsCatalog from './components/BrandsCatalog';
import DeliveriesSection from './components/deliveries-section';
import ContactSection from './components/contact-section';
import Footer from './components/footer';
import FloatingContact from './components/floating-contact';

export default function HomePage() {
  // Клік по артикулу в каталозі: підставляємо його у форму запиту і гортаємо до неї
  const handleSelectOem = (oem: string, brand: string) => {
    window.dispatchEvent(new CustomEvent('nlg:select-part', { detail: { oem, brand } }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      <Header />

      <HeroSection />

      {/* Форма запиту одразу під головним екраном: сюди ведуть усі кнопки «Зробити замовлення» */}
      <RFQSection />

      <BrandsCatalog onSelectOem={handleSelectOem} />

      <div id="deliveries">
        <DeliveriesSection />
      </div>

      <div id="contacts">
        <ContactSection />
      </div>

      <Footer />
      <FloatingContact />
    </div>
  );
}
