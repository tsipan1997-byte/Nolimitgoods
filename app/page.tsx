'use client';

import React, { useState } from 'react';
import Header from './components/header';
import HeroSection from './components/hero-section';
import BrandsCatalog from './components/BrandsCatalog';
import DeliveriesSection from './components/deliveries-section';
import ContactSection from './components/contact-section';
import Footer from './components/footer';
import FloatingContact from './components/floating-contact';

export default function HomePage() {
  // Функція для автоматичного підхоплення артикула з каталогу в інпут калькулятора
  const handleSelectOem = (oem: string, brand: string) => {
    const calcSection = document.getElementById('parts-calculator');
    const input = document.querySelector('input[type="text"]') as HTMLInputElement | null;

    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (input) {
      input.value = oem;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      {/* 1. Верхня фіксована навігація з B2B-порталом та логотипом */}
      <Header />

      {/* 2. Hero-секція з відеофоном та розрахунком */}
      <div id="parts-calculator">
        <HeroSection />
      </div>

      {/* 3. ЄДИНИЙ світлий преміальний каталог запчастин (8 карток у 2 ряди + робочі підгрупи) */}
      <BrandsCatalog onSelectOem={handleSelectOem} />

      {/* 4. Відео відвантажень запчастин із хабу у Ковентрі */}
      <div id="deliveries">
        <DeliveriesSection />
      </div>

      {/* 5. Юридичні реквізити NoLimitGoods Ltd та контакти */}
      <div id="contacts">
        <ContactSection />
      </div>

      {/* 6. Футер сайту */}
      <Footer />

      {/* 7. Плаваюча кнопка зв'язку (WhatsApp / дзвінок) */}
      <FloatingContact />
    </div>
  );
}
